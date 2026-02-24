"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/mockUserData";

export default function AppRoutesPage() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const route = routes.find((r) => r.id === selected) ?? null;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {routes.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-cr-brown-900">{r.name}</div>
                <div className="mt-1 text-xs text-cr-brown-400">
                  {r.barsCount} bares • {r.etaMinutes} min
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={() => setSelected(r.id)}>
                Ver
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {route ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-cr-brown-100 bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold text-cr-brown-900 font-display">{route.name}</div>
                <div className="mt-1 text-sm text-cr-brown-600">{route.description}</div>
                <div className="mt-3 text-xs text-cr-brown-400">
                  {route.barsCount} bares • {route.etaMinutes} min
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={() => setSelected(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
