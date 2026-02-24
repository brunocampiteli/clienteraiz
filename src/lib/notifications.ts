export type AppNotificationType = "receipt_approved" | "new_nearby_bar" | "new_challenge" | "push_notification";

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  body?: string;
  createdAt: string;
  readAt?: string;
  href?: string;
};

const STORAGE_KEY = "cliente-raiz:notifications";
const CHANNEL_NAME = "cliente-raiz:notifications";

function safeParse(json: string | null): AppNotification[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    if (!Array.isArray(v)) return [];
    return v as AppNotification[];
  } catch {
    return [];
  }
}

export function readNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function writeNotifications(next: AppNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function broadcast() {
  if (typeof window === "undefined") return;
  if (!("BroadcastChannel" in window)) return;
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage({ t: "changed", at: Date.now() });
    bc.close();
  } catch {
    // ignore
  }
}

export function addNotification(input: Omit<AppNotification, "id" | "createdAt"> & { id?: string; createdAt?: string }) {
  if (typeof window === "undefined") return;

  const next: AppNotification = {
    id: input.id ?? `ntf_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: input.type,
    title: input.title,
    body: input.body,
    href: input.href,
    createdAt: input.createdAt ?? new Date().toISOString(),
    readAt: input.readAt,
  };

  const current = readNotifications();
  writeNotifications([next, ...current]);
  broadcast();
}

export function markNotificationRead(id: string) {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  const current = readNotifications();
  const next = current.map((n) => (n.id === id && !n.readAt ? { ...n, readAt: now } : n));
  writeNotifications(next);
  broadcast();
}

export function markAllNotificationsRead() {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  const current = readNotifications();
  const next = current.map((n) => (n.readAt ? n : { ...n, readAt: now }));
  writeNotifications(next);
  broadcast();
}

export function clearNotifications() {
  if (typeof window === "undefined") return;
  writeNotifications([]);
  broadcast();
}

export function subscribeNotifications(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => onChange();

  window.addEventListener("storage", handler);

  let bc: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    try {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = handler;
    } catch {
      bc = null;
    }
  }

  return () => {
    window.removeEventListener("storage", handler);
    if (bc) bc.close();
  };
}

export function countUnread(notifs: AppNotification[]): number {
  return notifs.filter((n) => !n.readAt).length;
}
