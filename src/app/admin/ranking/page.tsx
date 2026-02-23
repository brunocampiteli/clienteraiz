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

  const prizesForPeriod = React.useMemo(() => prizes.filter((p) => p.period === period), [period]);
  const prizeTop1 = React.useMemo(() => prizesForPeriod.find((p) => p.topRank === 1) ?? null, [prizesForPeriod]);
  const prizeTop2 = React.useMemo(() => prizesForPeriod.find((p) => p.topRank === 2) ?? null, [prizesForPeriod]);
  const prizeTop3 = React.useMemo(() => prizesForPeriod.find((p) => p.topRank === 3) ?? null, [prizesForPeriod]);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-semibold tracking-tight text-zinc-900">Ranking</div>
        <div className="mt-1 text-sm text-zinc-600">Ranking do mês (reseta todo mês) • premiados: Top 1, 2 e 3</div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-900">Período</div>
            <div className="mt-1 text-xs text-zinc-500">Selecione o mês/ano para ver os ganhadores daquele mês</div>
          </div>
          <div className="w-full sm:max-w-[220px]">
            <select
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
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

      <div className="grid gap-4 lg:grid-cols-3">
        {top3.map((item) => (
          <Card key={item.position}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-900">{item.userName}</div>
                <div className="mt-1 text-xs text-zinc-500">{item.points} pts</div>
                <div className="mt-2 text-xs text-zinc-600">
                  Prêmio: {item.position === 1 ? prizeTop1?.name ?? "—" : item.position === 2 ? prizeTop2?.name ?? "—" : prizeTop3?.name ?? "—"}
                </div>
              </div>
              <Badge variant={item.position === 1 ? "success" : item.position === 2 ? "neutral" : "warning"}>
                Top {item.position}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-3">
          <div className="text-sm font-medium text-zinc-900">Prêmios do mês</div>
          <div className="mt-1 text-xs text-zinc-500">Vinculados ao Top 1/2/3 do período selecionado</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-xs font-medium text-zinc-600">Top 1</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900">{prizeTop1?.name ?? "—"}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-xs font-medium text-zinc-600">Top 2</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900">{prizeTop2?.name ?? "—"}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-xs font-medium text-zinc-600">Top 3</div>
            <div className="mt-1 text-sm font-semibold text-zinc-900">{prizeTop3?.name ?? "—"}</div>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <THead>
            <TR>
              <TH>Posição</TH>
              <TH>Usuário</TH>
              <TH>Pontos</TH>
            </TR>
          </THead>
          <TBody>
            {ranking.map((r) => (
              <TR key={r.position}>
                <TD className="whitespace-nowrap">#{r.position}</TD>
                <TD>{r.userName}</TD>
                <TD className="whitespace-nowrap">{r.points}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
