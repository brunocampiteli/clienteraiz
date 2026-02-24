"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardValue } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { bars, receipts, users, getAdminRanking } from "@/lib/mockData";

const chartData = [
  { day: "Seg", value: 12 },
  { day: "Ter", value: 18 },
  { day: "Qua", value: 9 },
  { day: "Qui", value: 22 },
  { day: "Sex", value: 17 },
  { day: "Sáb", value: 14 },
  { day: "Dom", value: 10 },
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function statusBadge(status: string) {
  if (status === "approved" || status === "approved_auto") return <Badge variant="success">Aprovada</Badge>;
  if (status === "pending" || status === "pending_validation") return <Badge variant="warning">Pendente</Badge>;
  if (status === "needs_review") return <Badge variant="warning">Revisão</Badge>;
  if (status === "rejected" || status === "rejected_auto") return <Badge variant="danger">Rejeitada</Badge>;
  return <Badge variant="neutral">—</Badge>;
}

export default function AdminHomePage() {
  const totalUsers = users.length;
  const totalBars = bars.length;
  const receiptsLast30 = receipts.length;
  const redeemedPrizes = 38;

  const currentPeriod = "2026-01";
  const top3 = React.useMemo(() => getAdminRanking(currentPeriod).slice(0, 3), []);

  const max = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">Dashboard</div>
        <div className="mt-1 text-sm text-cr-brown-600">Visão geral do sistema</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de usuários</CardTitle>
          </CardHeader>
          <CardValue>{totalUsers}</CardValue>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total de bares</CardTitle>
          </CardHeader>
          <CardValue>{totalBars}</CardValue>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notas enviadas (30 dias)</CardTitle>
          </CardHeader>
          <CardValue>{receiptsLast30}</CardValue>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prêmios resgatados</CardTitle>
          </CardHeader>
          <CardValue>{redeemedPrizes}</CardValue>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4">
            <div className="text-sm font-semibold text-cr-brown-900">Notas enviadas por dia (7 dias)</div>
            <div className="mt-1 text-xs text-cr-brown-400">Mock chart</div>
          </div>
          <div className="flex h-52 items-end gap-2">
            {chartData.map((d) => (
              <div key={d.day} className="flex w-full flex-col items-center gap-2">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-cr-green-800 to-cr-green-600"
                  style={{ height: `${Math.max(8, Math.round((d.value / max) * 100))}%` }}
                  title={`${d.day}: ${d.value}`}
                />
                <div className="text-xs font-medium text-cr-brown-400">{d.day}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <div className="text-sm font-semibold text-cr-brown-900">Resumo</div>
            <div className="mt-1 text-xs text-cr-brown-400">Mock</div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-cr-brown-100 bg-cr-cream-100 p-3">
              <div className="text-xs text-cr-brown-400">Taxa de aprovação</div>
              <div className="mt-1 text-xl font-bold text-cr-green-700 font-display">82%</div>
            </div>
            <div className="rounded-xl border border-cr-brown-100 bg-cr-cream-100 p-3">
              <div className="text-xs text-cr-brown-400">Tempo médio de análise</div>
              <div className="mt-1 text-xl font-bold text-cr-brown-900 font-display">1d 4h</div>
            </div>
            <div className="rounded-xl border border-cr-brown-100 bg-cr-cream-100 p-3">
              <div className="text-xs text-cr-brown-400">Bares ativos</div>
              <div className="mt-1 text-xl font-bold text-cr-brown-900 font-display">
                {bars.filter((b) => b.active).length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-cr-brown-900">Ranking do mês (Top 3)</div>
              <div className="mt-1 text-xs text-cr-brown-400">Reseta todo mês</div>
            </div>
            <Link className="text-xs font-semibold text-cr-green-700 hover:underline" href="/admin/ranking">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-2">
            {top3.map((r) => (
              <div key={r.position} className="flex items-center justify-between rounded-xl border border-cr-brown-100 bg-cr-cream-100 p-3">
                <div>
                  <div className="text-sm font-semibold text-cr-brown-900">{r.userName}</div>
                  <div className="mt-1 text-xs text-cr-brown-400">{r.points} pts</div>
                </div>
                <Badge variant={r.position === 1 ? "gold" : r.position === 2 ? "success" : "neutral"}>Top {r.position}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4">
            <div className="text-sm font-semibold text-cr-brown-900">Últimas notas</div>
            <div className="mt-1 text-xs text-cr-brown-400">Mock data</div>
          </div>

          <Table>
            <THead>
              <TR>
                <TH>Data</TH>
                <TH>Usuário</TH>
                <TH>Bar</TH>
                <TH>Valor</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {receipts.slice(0, 6).map((r) => (
                <TR key={r.id}>
                  <TD className="whitespace-nowrap">{r.date}</TD>
                  <TD>{r.userName}</TD>
                  <TD>{r.barName}</TD>
                  <TD className="whitespace-nowrap">{formatCurrency(r.amount)}</TD>
                  <TD>{statusBadge(r.status)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
