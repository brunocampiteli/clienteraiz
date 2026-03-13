"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ranking } from "@/lib/mockUserData";
import { prizes } from "@/lib/mockData";
import { useUser } from "@/lib/context/UserContext";

const medals = ["🥇", "🥈", "🥉"];

export default function AppRankingPage() {
  const { user } = useUser();
  const current = ranking.find((r) => r.isCurrentUser);
  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  // Get prizes for current period (latest)
  const currentPeriod = "2026-01";
  const prizesMap = React.useMemo(() => {
    const map = new Map<number, (typeof prizes)[0]>();
    prizes
      .filter((p) => p.period === currentPeriod && p.topRank)
      .forEach((p) => map.set(p.topRank!, p));
    return map;
  }, []);

  const sortedPrizes = React.useMemo(
    () => prizes
      .filter((p) => p.period === currentPeriod && p.topRank)
      .sort((a, b) => (a.topRank ?? 99) - (b.topRank ?? 99)),
    [],
  );

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl bg-cr-dark-800 p-5 text-white shadow-lg relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cr-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="text-center relative">
          <div className="text-xs font-bold text-cr-dark-400 uppercase tracking-wider">Sua posicao no ranking</div>
          <div className="mt-1 text-6xl font-display text-cr-yellow-600 tracking-wider">
            #{current?.position ?? "–"}
          </div>
          <div className="mt-1 text-sm text-cr-dark-400">
            {current?.points.toLocaleString() ?? 0} pontos • {user?.barsVisited ?? 0} bares
          </div>
          {current && prizesMap.has(current.position) && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cr-yellow-600/20 px-3 py-1 text-xs font-bold text-cr-yellow-500">
              {prizesMap.get(current.position)?.emoji} Você ganha: {prizesMap.get(current.position)?.name}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-cr-dark-700 px-3 py-2 text-center">
            <div className="text-xs text-cr-dark-400 uppercase tracking-wider">Nivel</div>
            <div className="text-sm font-display mt-0.5 text-cr-cream-100 tracking-wider">{(user?.level ?? "Raiz Bronze").toUpperCase()}</div>
          </div>
          <div className="rounded-xl bg-cr-dark-700 px-3 py-2 text-center">
            <div className="text-xs text-cr-dark-400 uppercase tracking-wider">Meta: Top 5</div>
            <div className="text-sm font-display mt-0.5 text-cr-yellow-600 tracking-wider">
              {current ? (ranking[4].points - current.points > 0 ? `FALTAM ${(ranking[4].points - current.points).toLocaleString()} PTS` : "ATINGIDO! 🎉") : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Prizes of the month */}
      {sortedPrizes.length > 0 && (
        <div>
          <div className="text-base font-display text-cr-dark-800 tracking-wider mb-2">PREMIOS DO MES</div>
          <div className="space-y-2">
            {sortedPrizes.map((prize) => {
              const isUserPosition = current?.position === prize.topRank;
              return (
                <div
                  key={prize.id}
                  className={[
                    "flex items-center gap-3 rounded-2xl border px-4 py-3",
                    isUserPosition
                      ? "border-cr-yellow-300 bg-cr-yellow-50 ring-1 ring-cr-yellow-400/30"
                      : "border-cr-dark-200 bg-white",
                  ].join(" ")}
                >
                  <div className="text-2xl">{prize.emoji || "🏆"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-cr-dark-800">{prize.topRank}º lugar</span>
                      {isUserPosition && (
                        <Badge variant="warning">Você!</Badge>
                      )}
                    </div>
                    <div className="text-xs text-cr-dark-500 truncate">{prize.name}</div>
                    {prize.description && (
                      <div className="text-[10px] text-cr-dark-400 truncate">{prize.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Podium */}
      <div className="text-base font-display text-cr-dark-800 tracking-wider mb-1">TOP 3</div>
      <div className="flex items-end justify-center gap-3 pb-2">
        {/* 2nd place */}
        <div className="flex flex-col items-center w-[30%]">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md ring-2 ring-cr-dark-300"
            style={{ background: top3[1].avatarColor }}
          >
            {top3[1].userName.charAt(0)}
          </div>
          <div className="mt-1.5 text-xs font-bold text-cr-dark-700 text-center truncate w-full">
            {top3[1].userName}
          </div>
          <div className="text-[10px] text-cr-dark-400">{top3[1].points.toLocaleString()} pts</div>
          {prizesMap.has(2) && (
            <div className="text-[10px] text-cr-dark-500 font-semibold">{prizesMap.get(2)?.emoji} {prizesMap.get(2)?.name}</div>
          )}
          <div className="mt-2 w-full rounded-t-xl bg-gradient-to-b from-cr-dark-200 to-cr-dark-300 pt-6 pb-2 text-center">
            <span className="text-xl">{medals[1]}</span>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center w-[30%]">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg ring-3 ring-cr-yellow-600"
            style={{ background: top3[0].avatarColor }}
          >
            {top3[0].userName.charAt(0)}
          </div>
          <div className="mt-1.5 text-xs font-bold text-cr-dark-800 text-center truncate w-full">
            {top3[0].userName}
          </div>
          <div className="text-[10px] text-cr-yellow-800 font-bold">{top3[0].points.toLocaleString()} pts</div>
          {prizesMap.has(1) && (
            <div className="text-[10px] text-cr-yellow-700 font-semibold">{prizesMap.get(1)?.emoji} {prizesMap.get(1)?.name}</div>
          )}
          <div className="mt-2 w-full rounded-t-xl bg-gradient-to-b from-cr-yellow-400 to-cr-yellow-500 pt-10 pb-2 text-center">
            <span className="text-2xl">{medals[0]}</span>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center w-[30%]">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white shadow-md ring-2 ring-cr-green-400"
            style={{ background: top3[2].avatarColor }}
          >
            {top3[2].userName.charAt(0)}
          </div>
          <div className="mt-1.5 text-xs font-bold text-cr-dark-700 text-center truncate w-full">
            {top3[2].userName}
          </div>
          <div className="text-[10px] text-cr-dark-400">{top3[2].points.toLocaleString()} pts</div>
          {prizesMap.has(3) && (
            <div className="text-[10px] text-cr-dark-500 font-semibold">{prizesMap.get(3)?.emoji} {prizesMap.get(3)?.name}</div>
          )}
          <div className="mt-2 w-full rounded-t-xl bg-gradient-to-b from-cr-green-200 to-cr-green-300 pt-4 pb-2 text-center">
            <span className="text-xl">{medals[2]}</span>
          </div>
        </div>
      </div>

      {/* Full list */}
      <Card className="!p-0">
        <div className="px-4 py-3 border-b border-cr-dark-100">
          <div className="text-base font-display text-cr-dark-800 tracking-wider">RANKING COMPLETO</div>
          <div className="text-[11px] text-cr-dark-400">Atualizado mensalmente</div>
        </div>
        <div className="divide-y divide-cr-dark-100">
          {rest.map((r) => {
            const prize = prizesMap.get(r.position);
            return (
              <div
                key={r.position}
                className={[
                  "flex items-center gap-3 px-4 py-3 transition-colors",
                  r.isCurrentUser ? "bg-cr-yellow-50" : prize ? "bg-cr-cream-50" : "",
                ].join(" ")}
              >
                <div className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  r.isCurrentUser
                    ? "bg-cr-yellow-600 text-cr-dark-800"
                    : "bg-cr-dark-100 text-cr-dark-600",
                ].join(" ")}>
                  {r.position}
                </div>

                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: r.avatarColor }}
                >
                  {r.userName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={[
                    "text-sm truncate",
                    r.isCurrentUser ? "font-bold text-cr-yellow-900" : "font-semibold text-cr-dark-700",
                  ].join(" ")}>
                    {r.userName}
                    {r.isCurrentUser && " (voce)"}
                  </div>
                  <div className="text-[11px] text-cr-dark-400">
                    {r.barsVisited} bares visitados
                    {prize && (
                      <span className="ml-1.5 font-semibold text-cr-yellow-700">
                        {prize.emoji} {prize.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className={[
                    "text-sm font-bold",
                    r.isCurrentUser ? "text-cr-yellow-800" : "text-cr-dark-600",
                  ].join(" ")}>
                    {r.points.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-cr-dark-400">pts</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
