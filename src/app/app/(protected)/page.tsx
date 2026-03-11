"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { currentUser, bars as appBars, pointsHistory } from "@/lib/mockUserData";
import { useRoutes } from "@/lib/context/RouteContext";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
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

const CURRENT_USER_ID = "app_usr_1";

export default function AppHomePage() {
  const { getUserRoutes } = useRoutes();
  const recommended = appBars.slice(0, 3);

  const userRoutes = getUserRoutes(CURRENT_USER_ID);
  const activeRoute = userRoutes.find(
    (r) => r.active && r.participation?.status === "active"
  );

  const recentPoints = pointsHistory.filter((p) => p.status === "approved").slice(0, 3);
  const pendingCount = pointsHistory.filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-cr-dark-800 shadow-md ring-2 ring-cr-yellow-600/30"
          style={{ background: "#FBC02D" }}
        >
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm text-cr-dark-500">{getGreeting()},</div>
          <div className="text-xl font-display text-cr-dark-800 tracking-wider">{currentUser.name.toUpperCase()}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-cr-dark-800 p-3.5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cr-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">Pontos</div>
          <div className="mt-1 text-2xl font-display text-cr-yellow-600 tracking-wider">{currentUser.pointsTotal.toLocaleString()}</div>
          <div className="mt-0.5 text-[10px] text-cr-dark-400">+{currentUser.pointsThisMonth} este mes</div>
        </div>
        <div className="rounded-2xl bg-cr-burgundy-800 p-3.5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="text-[10px] font-bold text-cr-burgundy-300 uppercase tracking-wider">Nivel</div>
          <div className="mt-1 text-sm font-display text-white leading-tight tracking-wider">RAIZ BRONZE</div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-cr-yellow-600" style={{ width: `${currentUser.levelProgress}%` }} />
          </div>
        </div>
        <div className="rounded-2xl bg-cr-green-700 p-3.5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="text-[10px] font-bold text-cr-green-300 uppercase tracking-wider">Ranking</div>
          <div className="mt-1 text-2xl font-display text-white tracking-wider">#7</div>
          <div className="mt-0.5 text-[10px] text-cr-green-300">{currentUser.barsVisited} bares</div>
        </div>
      </div>

      {/* Active Route Card */}
      {activeRoute && (
        <div className="overflow-hidden rounded-2xl border-2 border-cr-yellow-600/30 bg-cr-dark-800 shadow-lg">
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeRoute.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-display text-cr-cream-100 tracking-wider">{activeRoute.name.toUpperCase()}</div>
                    <Badge variant="gold">Em andamento</Badge>
                  </div>
                  <div className="mt-0.5 text-xs text-cr-dark-400">
                    {activeRoute.visitedCount}/{activeRoute.bars.length} bares visitados
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cr-dark-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cr-yellow-600 to-cr-green-600 transition-all"
                style={{
                  width: `${activeRoute.bars.length > 0 ? Math.round((activeRoute.visitedCount / activeRoute.bars.length) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-cr-dark-400">
                <span>{activeRoute.prizeEmoji}</span>
                <span className="font-bold text-cr-yellow-600">{activeRoute.prize}</span>
              </div>
              <Link href={`/app/routes/${activeRoute.id}`}>
                <Button className="!py-1.5 !px-3 !text-xs">
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
          <div className="group flex items-center gap-3 rounded-2xl border border-cr-dark-200 bg-white p-4 shadow-sm transition-all hover:border-cr-yellow-600/50 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cr-yellow-100 text-cr-yellow-800 transition-colors group-hover:bg-cr-yellow-200">
              <IconReceipt className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-cr-dark-800">Enviar Nota</div>
              <div className="text-[11px] text-cr-dark-400">Pontuar agora</div>
            </div>
          </div>
        </Link>
        <Link href="/app/routes" className="block">
          <div className="group flex items-center gap-3 rounded-2xl border border-cr-dark-200 bg-white p-4 shadow-sm transition-all hover:border-cr-burgundy-800/30 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cr-burgundy-100 text-cr-burgundy-800 transition-colors group-hover:bg-cr-burgundy-200">
              <IconMap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-cr-dark-800">Rotas</div>
              <div className="text-[11px] text-cr-dark-400">Games ativos</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Pending Receipts Alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-cr-yellow-600/30 bg-cr-yellow-50 px-4 py-3">
          <div className="text-lg">⏳</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-cr-yellow-900">
              {pendingCount} nota{pendingCount > 1 ? "s" : ""} em analise
            </div>
            <div className="text-xs text-cr-yellow-800">Aguardando aprovacao da IA</div>
          </div>
          <Link href="/app/points">
            <Button variant="ghost" className="!text-xs !text-cr-yellow-800 !font-bold">Ver</Button>
          </Link>
        </div>
      )}

      {/* Recommended Bars */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-display text-cr-dark-800 tracking-wider">BARES PERTO DE VOCE</div>
          <Link href="/app/bars" className="text-xs font-bold text-cr-yellow-800 hover:text-cr-yellow-700 uppercase tracking-wider">
            Ver todos
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
          {recommended.map((b) => (
            <Link key={b.id} href={`/app/bars/${b.id}`} className="block min-w-[200px] flex-shrink-0">
              <div className="group overflow-hidden rounded-2xl border border-cr-dark-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative h-28 w-full bg-cr-cream-200">
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    fill
                    unoptimized
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-cr-dark-800/80 px-2 py-0.5 text-[10px] font-bold text-cr-yellow-600 backdrop-blur-sm">
                    <IconStar className="h-3 w-3" />
                    {b.rating}
                  </div>
                  <div className="absolute top-2 right-2 rounded-full bg-cr-dark-800/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {b.distanceKm.toFixed(1)} km
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-bold text-cr-dark-800">{b.name}</div>
                  <div className="mt-0.5 text-[11px] text-cr-dark-400">{b.neighborhood} • {b.category}</div>
                  <div className="mt-2 text-xs font-bold text-cr-green-700">
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
            <div className="text-base font-display text-cr-dark-800 tracking-wider">ATIVIDADE RECENTE</div>
            <Link href="/app/points" className="text-xs font-bold text-cr-yellow-800 hover:text-cr-yellow-700 uppercase tracking-wider">
              Ver tudo
            </Link>
          </div>
          <Card className="!p-0 divide-y divide-cr-dark-100">
            {recentPoints.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cr-yellow-100 text-sm">
                  🍺
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-cr-dark-800 truncate">{p.barName}</div>
                  <div className="text-[11px] text-cr-dark-400">{new Date(p.date).toLocaleDateString("pt-BR")}</div>
                </div>
                <div className="text-sm font-bold text-cr-green-700">+{p.points}</div>
              </div>
            ))}
          </Card>
        </div>
      )}

      <div className="h-2" />
    </div>
  );
}
