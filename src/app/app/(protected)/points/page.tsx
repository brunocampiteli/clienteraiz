"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { bars, pointsHistory } from "@/lib/mockUserData";
import { useUser } from "@/lib/context/UserContext";

function IconTrendUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

export default function AppPointsPage() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const barId = searchParams.get("barId");
  const receiptSent = searchParams.get("receiptSent");
  const bar = React.useMemo(() => {
    if (!barId) return null;
    return bars.find((b) => b.id === barId) ?? null;
  }, [barId]);

  const approvedPoints = pointsHistory.filter((p) => p.status === "approved");
  const pendingPoints = pointsHistory.filter((p) => p.status === "pending");
  const thisMonth = approvedPoints.reduce((sum, p) => sum + p.points, 0);

  const pointsTotal = user?.pointsTotal ?? 0;
  const nextLevelPoints = user?.nextLevelPoints ?? 2000;
  const progressPct = Math.min(100, Math.round((pointsTotal / Math.max(1, nextLevelPoints)) * 100));
  const remaining = nextLevelPoints - pointsTotal;

  return (
    <div className="space-y-4">
      {/* Receipt Sent Banner */}
      {receiptSent === "1" && (
        <div className="overflow-hidden rounded-2xl border border-cr-green-300 bg-cr-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">✅</div>
            <div>
              <div className="text-sm font-bold text-cr-green-800">Nota enviada com sucesso!</div>
              <div className="mt-0.5 text-xs text-cr-green-700">
                Sua nota esta em analise. Os pontos serao confirmados apos aprovacao.
              </div>
            </div>
          </div>
        </div>
      )}

      {bar && (
        <div className="rounded-2xl border border-cr-yellow-300 bg-cr-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📝</div>
            <div>
              <div className="text-sm font-bold text-cr-yellow-900">Nota para: {bar.name}</div>
              <div className="text-xs text-cr-yellow-800 mt-0.5">Aguardando aprovacao da IA</div>
            </div>
          </div>
        </div>
      )}

      {/* Points Summary */}
      <div className="overflow-hidden rounded-2xl bg-cr-dark-800 p-5 text-white shadow-lg relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cr-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start justify-between relative">
          <div>
            <div className="text-xs font-bold text-cr-dark-400 uppercase tracking-wider">Total de pontos</div>
            <div className="mt-1 text-5xl font-display text-cr-yellow-600 tracking-wider">
              {pointsTotal.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-cr-dark-400">
              <IconTrendUp className="h-3.5 w-3.5 text-cr-green-500" />
              +{user?.pointsThisMonth ?? 0} este mes
            </div>
          </div>
          <div className="rounded-xl bg-cr-dark-700 px-3 py-1.5 text-xs font-display text-cr-cream-100 tracking-wider uppercase">
            {user?.level ?? "Raiz Bronze"}
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-5 relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-cr-dark-400 uppercase tracking-wider">Progresso para {user?.nextLevel ?? "Raiz Prata"}</span>
            <span className="text-xs font-bold text-cr-yellow-600">{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-cr-dark-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cr-yellow-600 to-cr-green-600 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-cr-dark-400">
            Faltam <span className="font-bold text-cr-yellow-600">{remaining.toLocaleString()}</span> pontos
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-xl font-display text-cr-dark-800 tracking-wider">{user?.barsVisited ?? 0}</div>
          <div className="text-[10px] text-cr-dark-400 mt-0.5 uppercase tracking-wider font-bold">Bares</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-xl font-display text-cr-dark-800 tracking-wider">{user?.receiptsApproved ?? 0}</div>
          <div className="text-[10px] text-cr-dark-400 mt-0.5 uppercase tracking-wider font-bold">Notas</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-xl font-display text-cr-dark-800 tracking-wider">{thisMonth}</div>
          <div className="text-[10px] text-cr-dark-400 mt-0.5 uppercase tracking-wider font-bold">Este mes</div>
        </div>
      </div>

      {/* Pending */}
      {pendingPoints.length > 0 && (
        <div>
          <div className="mb-2 text-base font-display text-cr-dark-800 tracking-wider flex items-center gap-2">
            ⏳ EM ANALISE
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cr-yellow-100 px-1.5 text-[10px] font-bold text-cr-yellow-900">
              {pendingPoints.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingPoints.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-cr-yellow-300 bg-cr-yellow-50 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cr-yellow-200 text-sm">
                  📝
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-cr-dark-800">{p.barName}</div>
                  <div className="text-[11px] text-cr-dark-400">
                    {new Date(p.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-cr-yellow-800">+{p.points}</div>
                  <Badge variant="warning" className="!text-[10px] !px-2 !py-0">Pendente</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <div className="mb-3 text-base font-display text-cr-dark-800 tracking-wider">HISTORICO DE PONTOS</div>
        <Card className="!p-0 divide-y divide-cr-dark-100">
          {approvedPoints.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cr-green-100 text-sm">
                🍺
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-cr-dark-800 truncate">{p.barName}</div>
                <div className="text-[11px] text-cr-dark-400">
                  {new Date(p.date).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-cr-green-700">+{p.points}</div>
                <div className="text-[10px] text-cr-green-600 font-semibold">Aprovado</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
