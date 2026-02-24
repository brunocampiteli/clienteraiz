"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { bars, currentUser, pointsHistory } from "@/lib/mockUserData";

function IconTrendUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

export default function AppPointsPage() {
  const searchParams = useSearchParams();
  const barId = searchParams.get("barId");
  const receiptSent = searchParams.get("receiptSent");
  const bar = React.useMemo(() => {
    if (!barId) return null;
    return bars.find((b) => b.id === barId) ?? null;
  }, [barId]);

  const approvedPoints = pointsHistory.filter((p) => p.status === "approved");
  const pendingPoints = pointsHistory.filter((p) => p.status === "pending");
  const thisMonth = approvedPoints.reduce((sum, p) => sum + p.points, 0);

  const progressPct = Math.min(100, Math.round((currentUser.pointsTotal / currentUser.nextLevelPoints) * 100));
  const remaining = currentUser.nextLevelPoints - currentUser.pointsTotal;

  return (
    <div className="space-y-4">
      {/* Receipt Sent Banner */}
      {receiptSent === "1" && (
        <div className="overflow-hidden rounded-2xl border border-cr-green-200 bg-gradient-to-r from-cr-green-50 to-cr-cream-50 p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="text-sm font-bold text-cr-green-900">Nota enviada com sucesso!</div>
              <div className="mt-0.5 text-xs text-cr-green-700">
                Sua nota está em análise. Os pontos serão confirmados após aprovação.
              </div>
            </div>
          </div>
        </div>
      )}

      {bar && (
        <div className="rounded-2xl border border-cr-gold-200 bg-cr-gold-50 p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📝</div>
            <div>
              <div className="text-sm font-bold text-cr-gold-900">Nota para: {bar.name}</div>
              <div className="text-xs text-cr-gold-700 mt-0.5">Aguardando aprovação da IA</div>
            </div>
          </div>
        </div>
      )}

      {/* Points Summary */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-cr-green-800 via-cr-green-900 to-cr-green-950 p-5 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-cr-green-200">Total de pontos</div>
            <div className="mt-1 text-4xl font-bold font-display tracking-tight">
              {currentUser.pointsTotal.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-cr-green-300">
              <IconTrendUp className="h-3.5 w-3.5" />
              +{currentUser.pointsThisMonth} este mês
            </div>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
            {currentUser.level}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-cr-green-200">Progresso para {currentUser.nextLevel}</span>
            <span className="text-xs font-bold text-cr-gold-300">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cr-gold-400 to-cr-gold-300 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-cr-green-300">
            Faltam <span className="font-semibold text-cr-gold-300">{remaining.toLocaleString()}</span> pontos
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">{currentUser.barsVisited}</div>
          <div className="text-[10px] text-cr-brown-400 mt-0.5">Bares visitados</div>
        </div>
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">{currentUser.receiptsApproved}</div>
          <div className="text-[10px] text-cr-brown-400 mt-0.5">Notas aprovadas</div>
        </div>
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">{thisMonth}</div>
          <div className="text-[10px] text-cr-brown-400 mt-0.5">Pts este mês</div>
        </div>
      </div>

      {/* Pending */}
      {pendingPoints.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-bold text-cr-brown-900 font-display flex items-center gap-2">
            ⏳ Em análise
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cr-gold-100 px-1.5 text-[10px] font-bold text-cr-gold-800">
              {pendingPoints.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingPoints.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-cr-gold-200 bg-cr-gold-50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cr-gold-100 text-sm">
                  📝
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-cr-brown-900">{p.barName}</div>
                  <div className="text-[11px] text-cr-brown-400">
                    {new Date(p.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-cr-gold-700">+{p.points}</div>
                  <Badge variant="warning" className="!text-[10px] !px-2 !py-0">Pendente</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <div className="mb-3 text-sm font-bold text-cr-brown-900 font-display">Histórico de pontos</div>
        <Card className="!p-0 divide-y divide-cr-brown-100/50">
          {approvedPoints.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cr-green-50 text-sm">
                🍺
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-cr-brown-900 truncate">{p.barName}</div>
                <div className="text-[11px] text-cr-brown-400">
                  {new Date(p.date).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-cr-green-700">+{p.points}</div>
                <div className="text-[10px] text-cr-green-600">Aprovado</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
