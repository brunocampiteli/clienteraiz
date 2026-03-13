"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { adminRankingByPeriod, getAdminRanking, prizes } from "@/lib/mockData";

export default function RankingPage() {
  const periods = React.useMemo(() => Object.keys(adminRankingByPeriod).sort().reverse(), []);
  const [period, setPeriod] = React.useState<string>(periods[0] ?? "2026-01");

  const ranking = React.useMemo(() => getAdminRanking(period), [period]);
  const top3 = React.useMemo(() => ranking.slice(0, 3), [ranking]);

  const prizesForPeriod = React.useMemo(
    () => prizes.filter((p) => p.period === period && p.topRank).sort((a, b) => (a.topRank ?? 99) - (b.topRank ?? 99)),
    [period],
  );
  const prizesMap = React.useMemo(
    () => new Map(prizesForPeriod.map((p) => [p.topRank!, p])),
    [prizesForPeriod],
  );

  const positionBadgeVariant = (pos: number) => {
    if (pos === 1) return "gold" as const;
    if (pos === 2) return "neutral" as const;
    if (pos === 3) return "burgundy" as const;
    return "success" as const;
  };

  const positionIcon = (pos: number) => {
    if (pos === 1) return "🥇";
    if (pos === 2) return "🥈";
    if (pos === 3) return "🥉";
    return `#${pos}`;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">Ranking</h1>
        <p className="mt-1 text-sm text-cr-brown-500">
          Ranking do mês (reseta todo mês) &bull; {prizesForPeriod.length} posição(ões) premiada(s)
        </p>
      </div>

      {/* Period selector */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-cr-brown-900">Período</h2>
            <p className="mt-1 text-xs text-cr-brown-500">Selecione o mês/ano para ver os ganhadores</p>
          </div>
          <div className="w-full sm:max-w-[220px]">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Mês/Ano</label>
            <select
              className="admin-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Top 3 podium cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {top3.map((item) => {
          const prize = prizesMap.get(item.position);
          return (
            <Card key={item.position} className={item.position === 1 ? "ring-2 ring-cr-gold-400/50" : ""}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{positionIcon(item.position)}</span>
                    <span className="text-base font-bold tracking-tight text-cr-brown-900">{item.userName}</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">{item.points} <span className="text-sm font-medium text-cr-brown-500">pts</span></div>
                </div>
                <Badge variant={positionBadgeVariant(item.position)}>
                  Top {item.position}
                </Badge>
              </div>
              <div className="mt-4 rounded-lg border border-cr-brown-100 bg-cr-brown-50 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Prêmio</span>
                <div className="mt-1 flex items-center gap-2">
                  {prize?.emoji && <span className="text-lg">{prize.emoji}</span>}
                  <div>
                    <div className="text-sm font-semibold text-cr-brown-900">{prize?.name ?? "—"}</div>
                    {prize?.description && (
                      <div className="text-xs text-cr-brown-500">{prize.description}</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Prizes of the month - dynamic N positions */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-bold tracking-tight text-cr-brown-900">Prêmios do mês</h2>
          <p className="mt-1 text-xs text-cr-brown-500">
            {prizesForPeriod.length} prêmio(s) configurado(s) para o período {period}
          </p>
        </div>
        {prizesForPeriod.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {prizesForPeriod.map((prize) => (
              <div
                key={prize.id}
                className={[
                  "rounded-xl border p-4",
                  prize.topRank === 1
                    ? "border-cr-gold-200 bg-cr-gold-50"
                    : prize.topRank === 2
                    ? "border-cr-brown-200 bg-cr-brown-50"
                    : prize.topRank === 3
                    ? "border-cr-gold-100 bg-cr-cream-50"
                    : "border-cr-brown-100 bg-white",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={positionBadgeVariant(prize.topRank!)}>
                    {prize.topRank}º lugar
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{prize.emoji || "🏆"}</span>
                  <div>
                    <div className="text-sm font-bold text-cr-brown-900">{prize.name}</div>
                    {prize.description && (
                      <div className="text-xs text-cr-brown-500 mt-0.5">{prize.description}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-cr-brown-400">
            Nenhum prêmio configurado para este período
          </div>
        )}
      </Card>

      {/* Full ranking table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-bold tracking-tight text-cr-brown-900">Ranking completo</h2>
          <p className="mt-1 text-xs text-cr-brown-500">{ranking.length} participantes no período {period}</p>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Posição</TH>
              <TH>Usuário</TH>
              <TH>Pontos</TH>
              <TH>Prêmio</TH>
            </TR>
          </THead>
          <TBody>
            {ranking.map((r) => {
              const prize = prizesMap.get(r.position);
              return (
                <TR key={r.position} className={prize ? "bg-cr-gold-50/50" : ""}>
                  <TD className="whitespace-nowrap font-medium">
                    {r.position <= 3 ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span>{positionIcon(r.position)}</span>
                        <span>#{r.position}</span>
                      </span>
                    ) : (
                      <span className="text-cr-brown-500">#{r.position}</span>
                    )}
                  </TD>
                  <TD>{r.userName}</TD>
                  <TD className="whitespace-nowrap font-semibold">{r.points}</TD>
                  <TD>
                    {prize ? (
                      <span className="inline-flex items-center gap-1.5 text-sm">
                        <span>{prize.emoji || "🏆"}</span>
                        <span className="font-medium text-cr-brown-800">{prize.name}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-cr-brown-300">—</span>
                    )}
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
