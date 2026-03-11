"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import {
  isPushSupported,
  isAlreadySubscribed,
  wasDismissed,
  dismiss,
  subscribeToPush,
} from "@/lib/pushClient";

export function PushPermissionBanner() {
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isPushSupported() && !isAlreadySubscribed() && !wasDismissed()) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  async function handleEnable() {
    setLoading(true);
    const success = await subscribeToPush();
    setLoading(false);
    if (success) {
      setVisible(false);
    }
  }

  function handleDismiss() {
    dismiss();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="mx-4 mt-2 flex items-center gap-3 rounded-2xl border border-cr-yellow-600/30 bg-cr-dark-800 px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cr-yellow-600 text-cr-dark-800 text-base">
        🔔
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-cr-cream-100">
          Ativar notificacoes
        </div>
        <div className="text-xs text-cr-dark-400">
          Receba avisos de notas aprovadas, desafios e novidades
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-cr-dark-400 hover:text-cr-dark-300 transition-colors"
        >
          Agora nao
        </button>
        <Button
          variant="primary"
          className="!py-1.5 !px-3 !text-xs"
          onClick={handleEnable}
          disabled={loading}
        >
          {loading ? "Ativando..." : "Ativar"}
        </Button>
      </div>
    </div>
  );
}
