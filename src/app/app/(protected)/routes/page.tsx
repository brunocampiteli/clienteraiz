"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRoutes } from "@/lib/context/RouteContext";
import type { RouteWithProgress } from "@/lib/types";

const CURRENT_USER_ID = "app_usr_1";

type TabKey = "active" | "completed" | "all";

const difficultyConfig = {
  "fácil": { color: "bg-cr-green-100 text-cr-green-800 ring-cr-green-300", dots: 1 },
  "médio": { color: "bg-cr-yellow-100 text-cr-yellow-900 ring-cr-yellow-300", dots: 2 },
  "difícil": { color: "bg-cr-burgundy-100 text-cr-burgundy-800 ring-cr-burgundy-300", dots: 3 },
};

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" />
    </svg>
  );
}

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0Zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0Z" />
    </svg>
  );
}

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0Z" />
    </svg>
  );
}

function daysLeft(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/** Determine user-facing status for a route */
function getRouteStatus(route: RouteWithProgress): "active" | "completed" | "locked" {
  if (route.participation?.status === "completed") return "completed";
  if (!route.active) return "locked";
  return "active";
}

function RouteCard({
  route,
  onJoin,
}: {
  route: RouteWithProgress;
  onJoin: (routeId: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const visited = route.visitedCount;
  const total = route.bars.length;
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
  const days = daysLeft(route.deadline);
  const status = getRouteStatus(route);
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const hasJoined = route.participation !== null;
  const diff = difficultyConfig[route.difficulty];

  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border transition-all duration-300",
        isLocked
          ? "border-cr-dark-200 bg-cr-dark-50 opacity-75"
          : isCompleted
          ? "border-cr-green-300 bg-white shadow-sm"
          : "border-cr-dark-200 bg-white shadow-sm hover:shadow-md hover:border-cr-yellow-600/30",
      ].join(" ")}
    >
      <button
        type="button"
        className="w-full text-left p-4 cursor-pointer"
        onClick={() => !isLocked && setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-12 w-12 items-center justify-center rounded-xl text-xl",
              isCompleted
                ? "bg-cr-green-100"
                : isLocked
                ? "bg-cr-dark-100"
                : "bg-cr-yellow-100",
            ].join(" ")}
          >
            {isLocked ? <IconLock className="h-5 w-5 text-cr-dark-400" /> : route.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-sm font-bold text-cr-dark-800">{route.name}</div>
              {isCompleted && <Badge variant="success">Concluida</Badge>}
              {isLocked && <Badge variant="neutral">Bloqueada</Badge>}
            </div>

            <div className="mt-1 flex items-center gap-3 text-[11px] text-cr-dark-400">
              <span>{total} bares</span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: diff.dots }).map((_, i) => (
                  <span key={i} className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                ))}
                {" "}{route.difficulty}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <IconUsers className="h-3 w-3" />
                {route.participantsCount}
              </span>
            </div>

            {!isLocked && (
              <div className="mt-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-cr-dark-500">
                    {visited}/{total} bares
                  </span>
                  <span className="text-[11px] font-bold text-cr-green-700">{pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-cr-dark-100">
                  <div
                    className={[
                      "h-full rounded-full transition-all duration-500",
                      isCompleted
                        ? "bg-cr-green-600"
                        : "bg-gradient-to-r from-cr-yellow-600 to-cr-green-600",
                    ].join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {!isLocked && !isCompleted && (
          <div className={[
            "mt-3 flex items-center justify-between rounded-xl px-3 py-2.5",
            days <= 2 ? "bg-cr-burgundy-50 border border-cr-burgundy-300" : days <= 4 ? "bg-cr-yellow-50 border border-cr-yellow-300" : "bg-cr-dark-50 border border-cr-dark-100",
          ].join(" ")}>
            <div className="flex items-center gap-2">
              <span className="text-base">{route.prizeEmoji}</span>
              <div>
                <div className="text-xs font-bold text-cr-dark-800">{route.prize}</div>
                <div className="text-[10px] text-cr-yellow-800 font-semibold">+{route.bonusPoints} pts bonus</div>
              </div>
            </div>
            <div className={[
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5",
              days <= 2 ? "bg-cr-burgundy-100 text-cr-burgundy-800" : days <= 4 ? "bg-cr-yellow-200 text-cr-yellow-900" : "bg-cr-dark-100 text-cr-dark-600",
            ].join(" ")}>
              <IconClock className="h-3.5 w-3.5" />
              <div className="text-center">
                <div className="text-sm font-bold leading-none">{days > 0 ? days : "!"}</div>
                <div className="text-[9px] font-semibold leading-tight">{days > 0 ? (days === 1 ? "dia" : "dias") : "Ultimo dia"}</div>
              </div>
            </div>
          </div>
        )}
        {!isLocked && isCompleted && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-cr-green-50 border border-cr-green-200 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{route.prizeEmoji}</span>
              <div>
                <div className="text-xs font-bold text-cr-green-800">{route.prize}</div>
                <div className="text-[10px] text-cr-green-600 font-semibold">+{route.bonusPoints} pts bonus ganhos</div>
              </div>
            </div>
            <Badge variant="success">Premio resgatado</Badge>
          </div>
        )}
      </button>

      {expanded && !isLocked && (
        <div className="border-t border-cr-dark-100 px-4 pb-4 pt-3">
          <div className="text-xs font-bold text-cr-dark-500 mb-3 uppercase tracking-wider">Etapas da rota</div>
          <div className="space-y-0">
            {route.bars.map((bar, i) => (
              <div key={`${bar.barId}-${i}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={[
                      "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold",
                      bar.visited
                        ? "border-cr-green-600 bg-cr-green-600 text-white"
                        : "border-cr-dark-300 bg-white text-cr-dark-400",
                    ].join(" ")}
                  >
                    {bar.visited ? (
                      <IconCheck className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < route.bars.length - 1 && (
                    <div className={[
                      "w-0.5 flex-1 min-h-[20px]",
                      bar.visited ? "bg-cr-green-300" : "bg-cr-dark-200",
                    ].join(" ")} />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={[
                        "text-sm font-semibold",
                        bar.visited ? "text-cr-green-800" : "text-cr-dark-700",
                      ].join(" ")}>
                        {bar.barName}
                      </div>
                      <div className="text-[11px] text-cr-dark-400">{bar.neighborhood}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-cr-green-700">+{bar.points} pts</div>
                      {bar.visited && (
                        <div className="text-[10px] text-cr-green-600 font-semibold">Visitado</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isCompleted && !hasJoined && (
            <Button className="w-full mt-2" onClick={(e) => { e.stopPropagation(); onJoin(route.id); }}>
              Participar desta rota
            </Button>
          )}

          {!isCompleted && hasJoined && (
            <Link href={`/app/routes/${route.id}`}>
              <Button className="w-full mt-2">
                {visited > 0 ? "Continuar rota" : "Ver detalhes"}
              </Button>
            </Link>
          )}

          {isCompleted && (
            <div className="mt-2 rounded-xl bg-cr-green-50 border border-cr-green-200 p-3 text-center">
              <div className="text-sm font-bold text-cr-green-800">🎉 Rota concluida!</div>
              <div className="text-xs text-cr-green-700 mt-0.5">
                Voce ganhou {route.bonusPoints} pontos bonus + {route.prize}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AppRoutesPage() {
  const { getUserRoutes, participateInRoute } = useRoutes();
  const [tab, setTab] = React.useState<TabKey>("active");

  const allRoutes = getUserRoutes(CURRENT_USER_ID);

  // Only show active routes to user
  const visibleRoutes = allRoutes.filter((r) => r.active || r.participation?.status === "completed");

  const filtered = React.useMemo(() => {
    if (tab === "active") return visibleRoutes.filter((r) => getRouteStatus(r) === "active" || getRouteStatus(r) === "locked");
    if (tab === "completed") return visibleRoutes.filter((r) => getRouteStatus(r) === "completed");
    return visibleRoutes;
  }, [tab, visibleRoutes]);

  const activeCount = visibleRoutes.filter((r) => getRouteStatus(r) === "active").length;
  const completedCount = visibleRoutes.filter((r) => getRouteStatus(r) === "completed").length;

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "active", label: "Ativas", count: activeCount },
    { key: "completed", label: "Concluidas", count: completedCount },
    { key: "all", label: "Todas" },
  ];

  function handleJoin(routeId: string) {
    participateInRoute(CURRENT_USER_ID, routeId);
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-2xl bg-cr-dark-800 p-5 text-white shadow-lg relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cr-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 relative">
          <div className="text-3xl">🗺️</div>
          <div>
            <div className="text-xl font-display text-cr-cream-100 tracking-wider">ROTAS PRONTAS</div>
            <div className="mt-0.5 text-sm text-cr-dark-400">
              Complete rotas, visite bares e ganhe premios exclusivos
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 relative">
          <div className="rounded-xl bg-cr-dark-700 px-3 py-2 text-center">
            <div className="text-xl font-display text-cr-yellow-600 tracking-wider">{activeCount}</div>
            <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider font-bold">Ativas</div>
          </div>
          <div className="rounded-xl bg-cr-dark-700 px-3 py-2 text-center">
            <div className="text-xl font-display text-cr-green-500 tracking-wider">{completedCount}</div>
            <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider font-bold">Concluidas</div>
          </div>
          <div className="rounded-xl bg-cr-dark-700 px-3 py-2 text-center">
            <div className="text-xl font-display text-cr-cream-100 tracking-wider">
              {visibleRoutes.reduce((s, r) => s + (getRouteStatus(r) === "completed" ? r.bonusPoints : 0), 0)}
            </div>
            <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider font-bold">Pts ganhos</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-cr-dark-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider",
              tab === t.key
                ? "bg-cr-yellow-600 text-cr-dark-800 shadow-sm"
                : "text-cr-dark-500 hover:text-cr-dark-700",
            ].join(" ")}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={[
                "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold",
                tab === t.key ? "bg-cr-dark-800/20 text-cr-dark-800" : "bg-cr-dark-200 text-cr-dark-500",
              ].join(" ")}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Route Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <div className="text-3xl mb-2">🍺</div>
            <div className="text-sm font-bold text-cr-dark-600">Nenhuma rota encontrada</div>
            <div className="text-xs text-cr-dark-400 mt-1">
              {tab === "completed" ? "Complete uma rota para ve-la aqui!" : "Novas rotas em breve!"}
            </div>
          </div>
        )}
        {filtered.map((route) => (
          <RouteCard key={route.id} route={route} onJoin={handleJoin} />
        ))}
      </div>
    </div>
  );
}
