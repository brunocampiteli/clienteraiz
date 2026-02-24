"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  clearNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  readNotifications,
  subscribeNotifications,
  type AppNotification,
} from "@/lib/notifications";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = React.useState<AppNotification[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    setItems(readNotifications());
    return subscribeNotifications(() => setItems(readNotifications()));
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Card className="w-full max-w-lg">
        <div className="flex max-h-[80vh] flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-cr-brown-900 font-display">Notificações</div>
              <div className="mt-1 text-sm text-cr-brown-600">Atualizações do sistema</div>
            </div>
            <Button type="button" variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button type="button" variant="secondary" onClick={() => markAllNotificationsRead()}>
              Marcar todas como lidas
            </Button>
            <Button type="button" variant="ghost" onClick={() => clearNotifications()}>
              Limpar
            </Button>
          </div>

          <div className="mt-4 flex-1 space-y-2 overflow-auto">
            {items.length === 0 ? (
              <div className="rounded-lg border border-cr-brown-100 bg-cr-cream-100 p-3 text-sm text-cr-brown-600">Sem notificações</div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={[
                    "w-full rounded-lg border border-cr-brown-100 p-3 text-left transition-colors",
                    n.readAt ? "bg-white" : "bg-cr-cream-100",
                  ].join(" ")}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.href) {
                      window.location.href = n.href;
                      return;
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-cr-brown-900">{n.title}</div>
                      {n.body ? <div className="mt-1 text-xs text-cr-brown-600">{n.body}</div> : null}
                      <div className="mt-2 text-xs text-cr-brown-400">{formatDate(n.createdAt)}</div>
                    </div>
                    <div className="text-xs text-cr-brown-400">{n.readAt ? "Lida" : "Nova"}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>,
    document.body
  );
}
