"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { bars, pointsHistory } from "@/lib/mockUserData";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AppBarsPage() {
  const [q, setQ] = React.useState("");

  const visitedBarIds = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const isInCurrentMonth = (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return false;
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    };

    return new Set(pointsHistory.filter((p) => isInCurrentMonth(p.date)).map((p) => p.barId));
  }, []);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return bars;
    return bars.filter((b) => b.name.toLowerCase().includes(query) || b.city.toLowerCase().includes(query));
  }, [q]);

  return (
    <div className="space-y-4">
      <div>
        <Input placeholder="Buscar por nome ou cidade..." value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="mt-2 text-xs text-cr-brown-400">{filtered.length} resultado(s)</div>
      </div>

      <div className="space-y-3">
        {filtered.map((b) => (
          <Card key={b.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2">
                  <div className="h-16 w-16 overflow-hidden rounded-lg border border-cr-brown-100 bg-cr-cream-200">
                    <Image
                      src={b.imageUrl}
                      alt={b.name}
                      className="h-full w-full object-cover"
                      width={64}
                      height={64}
                      unoptimized
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-cr-brown-900">{b.name}</div>
                  {visitedBarIds.has(b.id) ? <Badge variant="success">Já visitou este mês</Badge> : null}
                </div>
                <div className="mt-1 text-xs text-cr-brown-400">
                  {b.neighborhood} • {b.city}
                </div>
                <div className="mt-2 text-xs text-cr-brown-400">Consumo mínimo</div>
                <div className="text-sm font-semibold text-cr-brown-900">{formatCurrency(b.minimumSpend)}</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-cr-brown-400">Distância</div>
                <div className="text-sm font-semibold text-cr-brown-900">{b.distanceKm.toFixed(1)} km</div>
                <div className="mt-3">
                  <Link href={`/app/bars/${b.id}`}>
                    <Button>Ver detalhes</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
