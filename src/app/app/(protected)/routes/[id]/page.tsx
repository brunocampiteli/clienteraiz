"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRoutes } from "@/lib/context/RouteContext";

const CURRENT_USER_ID = "app_usr_1";

const difficultyConfig = {
  "fácil": { label: "Fácil", color: "text-cr-green-700 bg-cr-green-100", dots: 1 },
  "médio": { label: "Médio", color: "text-cr-yellow-900 bg-cr-yellow-100", dots: 2 },
  "difícil": { label: "Difícil", color: "text-cr-burgundy-800 bg-cr-burgundy-100", dots: 3 },
};

function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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

export default function RouteDetailsPage() {
  const params = useParams();
  const routeId = params.id as string;
  const { getRouteWithProgress, participateInRoute } = useRoutes();

  const route = getRouteWithProgress(CURRENT_USER_ID, routeId);

  if (!route) {
    return (
      <div className="space-y-4">
        <Link href="/app/routes" className="inline-flex items-center gap-2 text-sm text-cr-dark-500 hover:text-cr-dark-700">
          <IconArrowLeft className="h-4 w-4" /> Voltar para rotas
        </Link>
        <div className="py-16 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-lg font-bold text-cr-dark-700">Rota não encontrada</div>
          <div className="text-sm text-cr-dark-400 mt-1">Esta rota pode ter sido removida ou não existe.</div>
        </div>
      </div>
    );
  }

  const visited = route.visitedCount;
  const total = route.bars.length;
  const pct = total > 0 ? Math.round((visited / total) * 100) : 0;
  const days = daysLeft(route.deadline);
  const isCompleted = route.participation?.status === "completed";
  const hasJoined = route.participation !== null;
  const diff = difficultyConfig[route.difficulty];

  function handleJoin() {
    if (!route) return;
    participateInRoute(CURRENT_USER_ID, route.id);
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Back link */}
      <Link href="/app/routes" className="inline-flex items-center gap-2 text-sm text-cr-dark-500 hover:text-cr-dark-700 transition-colors">
        <IconArrowLeft className="h-4 w-4" /> Rotas
      </Link>

      {/* Route Header */}
      <div className={[
        "overflow-hidden rounded-2xl p-5 shadow-lg relative",
        isCompleted ? "bg-cr-green-800" : "bg-cr-dark-800",
      ].join(" ")}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className={[
              "flex h-14 w-14 items-center justify-center rounded-xl text-2xl",
              isCompleted ? "bg-cr-green-700" : "bg-cr-dark-700",
            ].join(" ")}>
              {route.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-display text-white tracking-wide">{route.name}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={["text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", diff.color].join(" ")}>
                  {diff.label}
                </span>
                {isCompleted && (
                  <Badge variant="success">Concluida</Badge>
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-cr-dark-300 leading-relaxed">{route.description}</p>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className={[
              "rounded-xl px-3 py-2 text-center",
              isCompleted ? "bg-cr-green-700" : "bg-cr-dark-700",
            ].join(" ")}>
              <div className="text-lg font-display text-white">{total}</div>
              <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider font-bold">Bares</div>
            </div>
            <div className={[
              "rounded-xl px-3 py-2 text-center",
              isCompleted ? "bg-cr-green-700" : "bg-cr-dark-700",
            ].join(" ")}>
              <div className="text-lg font-display text-cr-yellow-500">{route.bonusPoints}</div>
              <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider font-bold">Pts bonus</div>
            </div>
            <div className={[
              "rounded-xl px-3 py-2 text-center",
              isCompleted ? "bg-cr-green-700" : "bg-cr-dark-700",
            ].join(" ")}>
              <div className="text-lg font-display text-white flex items-center justify-center gap-1">
                <IconClock className="h-4 w-4" />
                {isCompleted ? "✓" : days}
              </div>
              <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider font-bold">
                {isCompleted ? "Completa" : days === 1 ? "Dia" : "Dias"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {hasJoined && (
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cr-dark-600 uppercase tracking-wider">Progresso</span>
            <span className={[
              "text-sm font-bold",
              isCompleted ? "text-cr-green-700" : "text-cr-yellow-700",
            ].join(" ")}>{pct}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-cr-dark-100">
            <div
              className={[
                "h-full rounded-full transition-all duration-700",
                isCompleted
                  ? "bg-cr-green-600"
                  : "bg-gradient-to-r from-cr-yellow-500 to-cr-green-500",
              ].join(" ")}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 text-xs text-cr-dark-400">
            {visited} de {total} bares visitados
          </div>
        </div>
      )}

      {/* Prize card */}
      <div className={[
        "rounded-2xl border p-4 shadow-sm",
        isCompleted
          ? "border-cr-green-200 bg-cr-green-50"
          : "border-cr-yellow-200 bg-cr-yellow-50",
      ].join(" ")}>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{route.prizeEmoji}</div>
          <div className="flex-1">
            <div className={[
              "text-xs font-bold uppercase tracking-wider",
              isCompleted ? "text-cr-green-600" : "text-cr-yellow-700",
            ].join(" ")}>
              {isCompleted ? "Premio conquistado!" : "Premio da rota"}
            </div>
            <div className={[
              "text-sm font-bold mt-0.5",
              isCompleted ? "text-cr-green-800" : "text-cr-dark-800",
            ].join(" ")}>
              {route.prize}
            </div>
            <div className={[
              "text-xs font-semibold mt-0.5",
              isCompleted ? "text-cr-green-600" : "text-cr-yellow-800",
            ].join(" ")}>
              +{route.bonusPoints} pontos bonus
            </div>
          </div>
          {isCompleted && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cr-green-600">
              <IconCheck className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-2xl border border-cr-dark-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-bold text-cr-dark-500 mb-4 uppercase tracking-wider">
          Etapas da rota
        </div>

        <div className="space-y-0">
          {route.bars.map((bar, i) => (
            <div key={`${bar.barId}-${i}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                    bar.visited
                      ? "border-cr-green-600 bg-cr-green-600 text-white shadow-md shadow-cr-green-200"
                      : "border-cr-dark-300 bg-white text-cr-dark-400",
                  ].join(" ")}
                >
                  {bar.visited ? (
                    <IconCheck className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < route.bars.length - 1 && (
                  <div className={[
                    "w-0.5 flex-1 min-h-[28px]",
                    bar.visited ? "bg-cr-green-300" : "bg-cr-dark-200",
                  ].join(" ")} />
                )}
              </div>

              <div className="flex-1 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={[
                      "text-sm font-bold",
                      bar.visited ? "text-cr-green-800" : "text-cr-dark-700",
                    ].join(" ")}>
                      {bar.barName}
                    </div>
                    <div className="text-xs text-cr-dark-400 mt-0.5">
                      {bar.neighborhood}{bar.city ? `, ${bar.city}` : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={[
                      "text-xs font-bold",
                      bar.visited ? "text-cr-green-600" : "text-cr-dark-400",
                    ].join(" ")}>
                      +{bar.points} pts
                    </div>
                    {bar.visited && (
                      <div className="text-[10px] text-cr-green-600 font-bold mt-0.5">✓ Visitado</div>
                    )}
                  </div>
                </div>

                {!bar.visited && hasJoined && !isCompleted && (
                  <div className="mt-2 rounded-lg bg-cr-dark-50 border border-cr-dark-100 px-3 py-2">
                    <div className="text-[11px] text-cr-dark-500">
                      Visite este bar e envie uma <span className="font-bold">nota fiscal</span> ou faça <span className="font-bold">check-in no Instagram</span> para validar
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      {!hasJoined && !isCompleted && (
        <Button className="w-full" onClick={handleJoin}>
          🗺️ Participar desta rota
        </Button>
      )}

      {hasJoined && !isCompleted && (
        <div className="space-y-2">
          <Link href="/app/bars">
            <Button className="w-full">
              🍺 Visitar próximo bar
            </Button>
          </Link>
          <div className="text-center text-xs text-cr-dark-400">
            Envie uma nota fiscal ou faça check-in para registrar sua visita
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="rounded-2xl bg-cr-green-50 border border-cr-green-200 p-5 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <div className="text-lg font-bold text-cr-green-800 font-display">Rota concluída!</div>
          <div className="text-sm text-cr-green-700 mt-1">
            Você ganhou <span className="font-bold">{route.bonusPoints} pontos bônus</span> e o prêmio <span className="font-bold">{route.prize}</span>
          </div>
          <Link href="/app/routes">
            <Button variant="secondary" className="mt-4">
              Ver outras rotas
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
