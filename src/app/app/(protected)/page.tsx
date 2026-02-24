"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { currentUser, bars as appBars, gameRoutes, pointsHistory } from "@/lib/mockUserData";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function IconTrophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875 3.375 3.375 0 0016.5 14.25m-9 4.5v-4.5A3.375 3.375 0 014.125 10.875 3.375 3.375 0 017.5 14.25m0 0h9M12 3.75l.938 2.813M12 3.75l-.938 2.813M12 3.75V2.25" />
    </svg>
  );
}

function IconStar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
    </svg>
  );
}

function IconMap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  );
}

function IconReceipt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0Z" />
    </svg>
  );
}

export default function AppHomePage() {
  const recommended = appBars.slice(0, 3);
  const activeRoute = gameRoutes.find((r) => r.status === "active");
  const recentPoints = pointsHistory.filter((p) => p.status === "approved").slice(0, 3);
  const pendingCount = pointsHistory.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${currentUser.avatarColor}, #1A3C2E)` }}
        >
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm text-cr-brown-500">{getGreeting()},</div>
          <div className="text-lg font-bold text-cr-brown-900 font-display">{currentUser.name} 👋</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-cr-green-800 to-cr-green-900 p-3.5 text-white shadow-md">
          <div className="text-[11px] font-medium text-cr-green-200">Pontos</div>
          <div className="mt-1 text-xl font-bold font-display">{currentUser.pointsTotal.toLocaleString()}</div>
          <div className="mt-0.5 text-[10px] text-cr-green-300">+{currentUser.pointsThisMonth} este mês</div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-cr-gold-600 to-cr-gold-700 p-3.5 text-white shadow-md">
          <div className="text-[11px] font-medium text-cr-gold-100">Nível</div>
          <div className="mt-1 text-sm font-bold font-display leading-tight">Raiz Bronze</div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${currentUser.levelProgress}%` }} />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-cr-brown-700 to-cr-brown-800 p-3.5 text-white shadow-md">
          <div className="text-[11px] font-medium text-cr-brown-200">Ranking</div>
          <div className="mt-1 text-xl font-bold font-display">#7</div>
          <div className="mt-0.5 text-[10px] text-cr-brown-300">{currentUser.barsVisited} bares</div>
        </div>
      </div>

      {/* Active Route Card */}
      {activeRoute && (
        <div className="overflow-hidden rounded-2xl border border-cr-green-200 bg-gradient-to-r from-cr-green-50 to-cr-cream-50 shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeRoute.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-cr-green-900 font-display">{activeRoute.name}</div>
                    <Badge variant="success">Em andamento</Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-cr-brown-500">
                    {activeRoute.bars.filter((b) => b.visited).length}/{activeRoute.bars.length} bares visitados
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cr-green-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cr-green-600 to-cr-gold-500 transition-all"
                style={{
                  width: `${Math.round((activeRoute.bars.filter((b) => b.visited).length / activeRoute.bars.length) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-cr-brown-500">
                <span>{activeRoute.prizeEmoji}</span>
                <span className="font-semibold text-cr-gold-700">{activeRoute.prize}</span>
              </div>
              <Link href="/app/routes">
                <Button variant="primary" className="!py-1.5 !px-3 !text-xs">
                  Continuar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/app/bars" className="block">
          <div className="group flex items-center gap-3 rounded-2xl border border-cr-brown-100 bg-white p-4 shadow-sm transition-all hover:border-cr-green-200 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cr-green-50 text-cr-green-700 transition-colors group-hover:bg-cr-green-100">
              <IconReceipt className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-cr-brown-900">Enviar Nota</div>
              <div className="text-[11px] text-cr-brown-400">Pontuar agora</div>
            </div>
          </div>
        </Link>
        <Link href="/app/routes" className="block">
          <div className="group flex items-center gap-3 rounded-2xl border border-cr-brown-100 bg-white p-4 shadow-sm transition-all hover:border-cr-gold-200 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cr-gold-50 text-cr-gold-700 transition-colors group-hover:bg-cr-gold-100">
              <IconMap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-cr-brown-900">Rotas</div>
              <div className="text-[11px] text-cr-brown-400">Games ativos</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Pending Receipts Alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-cr-gold-200 bg-cr-gold-50 px-4 py-3">
          <div className="text-lg">⏳</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-cr-gold-900">
              {pendingCount} nota{pendingCount > 1 ? "s" : ""} em análise
            </div>
            <div className="text-xs text-cr-gold-700">Aguardando aprovação da IA</div>
          </div>
          <Link href="/app/points">
            <Button variant="ghost" className="!text-xs !text-cr-gold-800">Ver</Button>
          </Link>
        </div>
      )}

      {/* Recommended Bars */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-cr-brown-900 font-display">Bares perto de você</div>
          <Link href="/app/bars" className="text-xs font-semibold text-cr-green-700 hover:text-cr-green-800">
            Ver todos →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {recommended.map((b) => (
            <Link key={b.id} href={`/app/bars/${b.id}`} className="block min-w-[200px] flex-shrink-0">
              <div className="group overflow-hidden rounded-2xl border border-cr-brown-100 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative h-28 w-full bg-cr-cream-200">
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    fill
                    unoptimized
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                    <IconStar className="h-3 w-3 text-cr-gold-400" />
                    {b.rating}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-cr-brown-700 backdrop-blur-sm">
                    {b.distanceKm.toFixed(1)} km
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-cr-brown-900">{b.name}</div>
                  <div className="mt-0.5 text-[11px] text-cr-brown-400">{b.neighborhood} • {b.category}</div>
                  <div className="mt-2 text-xs font-semibold text-cr-green-700">
                    A partir de {formatCurrency(b.minimumSpend)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentPoints.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold text-cr-brown-900 font-display">Atividade recente</div>
            <Link href="/app/points" className="text-xs font-semibold text-cr-green-700 hover:text-cr-green-800">
              Ver tudo →
            </Link>
          </div>
          <Card className="!p-0 divide-y divide-cr-brown-100/50">
            {recentPoints.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cr-green-50 text-sm">
                  🍺
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-cr-brown-900 truncate">{p.barName}</div>
                  <div className="text-[11px] text-cr-brown-400">{new Date(p.date).toLocaleDateString("pt-BR")}</div>
                </div>
                <div className="text-sm font-bold text-cr-green-700">+{p.points}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Bottom spacer for nav */}
      <div className="h-2" />
    </div>
  );
}
