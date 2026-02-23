"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { bars, currentUser, pointsHistory } from "@/lib/mockUserData";

export default function AppPointsPage() {
  const searchParams = useSearchParams();
  const barId = searchParams.get("barId");
  const receiptSent = searchParams.get("receiptSent");
  const bar = React.useMemo(() => {
    if (!barId) return null;
    return bars.find((b) => b.id === barId) ?? null;
  }, [barId]);

  return (
    <div className="space-y-4">
      {receiptSent === "1" ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <div className="text-sm font-semibold text-emerald-900">Nota enviada (pendente)</div>
          <div className="mt-1 text-sm text-emerald-900/80">
            Recebemos sua nota e ela entrou em <span className="font-semibold">análise</span>. Os pontos só serão
            confirmados após aprovação.
          </div>
        </Card>
      ) : null}

      {bar ? (
        <Card className="border-zinc-300 bg-zinc-50">
          <div className="text-sm font-semibold text-zinc-900">Enviar nota fiscal</div>
          <div className="mt-1 text-sm text-zinc-600">
            Você está enviando uma nota para: <span className="font-semibold">{bar.name}</span>
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Ao enviar, a nota fica <span className="font-semibold">pendente</span> até aprovação. (mock)
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-600">Total de pontos</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              {currentUser.pointsTotal}
            </div>
          </div>
          <Badge variant="neutral">{currentUser.level}</Badge>
        </div>
      </Card>

      <Card>
        <div className="mb-3">
          <div className="text-sm font-semibold text-zinc-900">Histórico</div>
          <div className="mt-1 text-xs text-zinc-500">Mock</div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Data</TH>
              <TH>Bar</TH>
              <TH>Pontos</TH>
            </TR>
          </THead>
          <TBody>
            {pointsHistory.map((it) => (
              <TR key={it.id}>
                <TD className="whitespace-nowrap">{it.date}</TD>
                <TD>{it.barName}</TD>
                <TD className="whitespace-nowrap">+{it.points}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
