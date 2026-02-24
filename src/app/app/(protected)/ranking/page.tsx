"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ranking, currentUser } from "@/lib/mockUserData";

const medals = ["🥇", "🥈", "🥉"];

export default function AppRankingPage() {
  const current = ranking.find((r) => r.isCurrentUser);
  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-cr-green-800 via-cr-green-900 to-cr-green-950 p-5 text-white shadow-lg">
        <div className="text-center">
          <div className="text-xs font-medium text-cr-green-200">Sua posição no ranking</div>
          <div className="mt-1 text-5xl font-bold font-display tracking-tight">
            #{current?.position ?? "–"}
          </div>
          <div className="mt-1 text-sm text-cr-green-300">
            {current?.points.toLocaleString() ?? 0} pontos • {currentUser.barsVisited} bares
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <div className="text-xs text-cr-green-200">Nível</div>
            <div className="text-sm font-bold font-display mt-0.5">{currentUser.level}</div>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur-sm">
            <div className="text-xs text-cr-green-200">Meta: Top 5</div>
            <div className="text-sm font-bold font-display mt-0.5">
              {current ? (ranking[4].points - current.points > 0 ? `Faltam ${(ranking[4].points - current.points).toLocaleString()} pts` : "Atingido! 🎉") : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="text-sm font-bold text-cr-brown-900 font-display mb-1">Top 3</div>
      <div className="flex items-end justify-center gap-3 pb-2">
        {/* 2nd place */}
        <div className="flex flex-col items-center w-[30%]">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-md ring-2 ring-cr-brown-200"
            style={{ background: top3[1].avatarColor }}
          >
            {top3[1].userName.charAt(0)}
          </div>
          <div className="mt-1.5 text-xs font-semibold text-cr-brown-800 text-center truncate w-full">
            {top3[1].userName}
          </div>
          <div className="text-[10px] text-cr-brown-400">{top3[1].points.toLocaleString()} pts</div>
          <div className="mt-2 w-full rounded-t-xl bg-gradient-to-b from-cr-brown-200 to-cr-brown-300 pt-6 pb-2 text-center">
            <span className="text-xl">{medals[1]}</span>
          </div>
        </div>

        {/* 1st place */}
        <div className="flex flex-col items-center w-[30%]">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg ring-3 ring-cr-gold-400"
            style={{ background: top3[0].avatarColor }}
          >
            {top3[0].userName.charAt(0)}
          </div>
          <div className="mt-1.5 text-xs font-bold text-cr-brown-900 text-center truncate w-full">
            {top3[0].userName}
          </div>
          <div className="text-[10px] text-cr-gold-700 font-semibold">{top3[0].points.toLocaleString()} pts</div>
          <div className="mt-2 w-full rounded-t-xl bg-gradient-to-b from-cr-gold-300 to-cr-gold-400 pt-10 pb-2 text-center">
            <span className="text-2xl">{medals[0]}</span>
          </div>
        </div>

        {/* 3rd place */}
        <div className="flex flex-col items-center w-[30%]">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white shadow-md ring-2 ring-cr-green-300"
            style={{ background: top3[2].avatarColor }}
          >
            {top3[2].userName.charAt(0)}
          </div>
          <div className="mt-1.5 text-xs font-semibold text-cr-brown-800 text-center truncate w-full">
            {top3[2].userName}
          </div>
          <div className="text-[10px] text-cr-brown-400">{top3[2].points.toLocaleString()} pts</div>
          <div className="mt-2 w-full rounded-t-xl bg-gradient-to-b from-cr-green-200 to-cr-green-300 pt-4 pb-2 text-center">
            <span className="text-xl">{medals[2]}</span>
          </div>
        </div>
      </div>

      {/* Full list */}
      <Card className="!p-0">
        <div className="px-4 py-3 border-b border-cr-brown-100/50">
          <div className="text-sm font-bold text-cr-brown-900 font-display">Ranking completo</div>
          <div className="text-[11px] text-cr-brown-400">Atualizado mensalmente</div>
        </div>
        <div className="divide-y divide-cr-brown-100/50">
          {rest.map((r) => (
            <div
              key={r.position}
              className={[
                "flex items-center gap-3 px-4 py-3 transition-colors",
                r.isCurrentUser ? "bg-cr-green-50" : "",
              ].join(" ")}
            >
              {/* Position */}
              <div className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                r.isCurrentUser
                  ? "bg-cr-green-800 text-white"
                  : "bg-cr-cream-200 text-cr-brown-600",
              ].join(" ")}>
                {r.position}
              </div>

              {/* Avatar */}
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: r.avatarColor }}
              >
                {r.userName.charAt(0)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className={[
                  "text-sm truncate",
                  r.isCurrentUser ? "font-bold text-cr-green-900" : "font-medium text-cr-brown-800",
                ].join(" ")}>
                  {r.userName}
                  {r.isCurrentUser && " (você)"}
                </div>
                <div className="text-[11px] text-cr-brown-400">{r.barsVisited} bares visitados</div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className={[
                  "text-sm font-bold",
                  r.isCurrentUser ? "text-cr-green-700" : "text-cr-brown-700",
                ].join(" ")}>
                  {r.points.toLocaleString()}
                </div>
                <div className="text-[10px] text-cr-brown-400">pts</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
