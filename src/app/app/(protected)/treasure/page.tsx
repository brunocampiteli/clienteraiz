"use client";

import { Badge } from "@/components/ui/Badge";
import { treasureMissions } from "@/lib/mockUserData";

export default function AppTreasurePage() {
  const completedCount = treasureMissions.filter((m) => m.progress >= m.total).length;
  const totalMissions = treasureMissions.length;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-cr-gold-600 via-cr-gold-700 to-cr-brown-700 p-5 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🏴‍☠️</div>
          <div>
            <div className="text-lg font-bold font-display">Caça ao Tesouro</div>
            <div className="mt-0.5 text-sm text-cr-gold-100">
              Complete missões para ganhar bônus e evoluir
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cr-gold-100">Progresso geral</span>
              <span className="text-xs font-bold">{completedCount}/{totalMissions} missões</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${Math.round((completedCount / totalMissions) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="space-y-3">
        {treasureMissions.map((m) => {
          const pct = Math.round((m.progress / m.total) * 100);
          const isDone = m.progress >= m.total;

          return (
            <div
              key={m.id}
              className={[
                "overflow-hidden rounded-2xl border transition-all",
                isDone
                  ? "border-cr-green-200 bg-white"
                  : "border-cr-brown-100 bg-white shadow-sm",
              ].join(" ")}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-xl text-lg flex-shrink-0",
                      isDone ? "bg-cr-green-100" : "bg-cr-gold-50",
                    ].join(" ")}
                  >
                    {m.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={[
                        "text-sm font-bold font-display",
                        isDone ? "text-cr-green-800" : "text-cr-brown-900",
                      ].join(" ")}>
                        {m.title}
                      </div>
                      {isDone && <Badge variant="success">Concluída ✓</Badge>}
                    </div>
                    <div className="mt-0.5 text-xs text-cr-brown-500">{m.description}</div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-cr-brown-500">
                          {m.progress}/{m.total}
                        </span>
                        <span className={[
                          "text-[11px] font-bold",
                          isDone ? "text-cr-green-600" : "text-cr-gold-700",
                        ].join(" ")}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-cr-cream-200">
                        <div
                          className={[
                            "h-full rounded-full transition-all duration-500",
                            isDone
                              ? "bg-cr-green-500"
                              : "bg-gradient-to-r from-cr-gold-500 to-cr-gold-400",
                          ].join(" ")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className="text-xs">🎁</span>
                      <span className={[
                        "text-xs font-semibold",
                        isDone ? "text-cr-green-600" : "text-cr-gold-700",
                      ].join(" ")}>
                        {m.reward}
                      </span>
                      {isDone && <span className="text-[10px] text-cr-green-500 font-medium">• Resgatado</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
