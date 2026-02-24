// Client-side push notification helpers

import { addNotification } from "@/lib/notifications";

const SW_PATH = "/sw.js";
const SUBSCRIBE_API = "/api/push/subscribe";
const LOCAL_STORAGE_KEY = "cliente-raiz:push_subscribed";
const DISMISSED_KEY = "cliente-raiz:push_dismissed";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: "/",
    });
    return registration;
  } catch (err) {
    console.error("[Push] SW registration failed:", err);
    return null;
  }
}

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isAlreadySubscribed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
}

export function wasDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DISMISSED_KEY) === "true";
}

export function dismiss(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DISMISSED_KEY, "true");
}

function markSubscribed() {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, "true");
}

export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  const registration = await registerServiceWorker();
  if (!registration) return false;

  const ready = await navigator.serviceWorker.ready;

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    console.error("[Push] No VAPID public key configured");
    return false;
  }

  const subscription = await ready.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  try {
    await fetch(SUBSCRIBE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    markSubscribed();
    return true;
  } catch (err) {
    console.error("[Push] Failed to send subscription to server:", err);
    return false;
  }
}

/** Listen for messages from the service worker and bridge into in-app notifications */
export function listenForPushMessages(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "push-received") {
      addNotification({
        type: "push_notification",
        title: event.data.title || "Notificação",
        body: event.data.body,
        href: event.data.url,
      });
    }
  });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
