"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
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

function StatIcon({ type }: { type: "users" | "bars" | "receipts" | "prizes" }) {
  const cn = "h-5 w-5";
  const p = { className: cn, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "users": return <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
    case "bars": return <svg {...p}><path d="M17 11h1a3 3 0 010 6h-1M5 8h12v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8zM7 3v5M11 3v5M15 3v5" /></svg>;
    case "receipts": return <svg {...p}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2zM8 10h8M8 14h4" /></svg>;
    case "prizes": return <svg {...p}><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></svg>;
  }
}

const statColors = {
  users: { icon: "text-blue-500", bg: "bg-blue-50", ring: "ring-blue-100" },
  bars: { icon: "text-cr-gold-600", bg: "bg-cr-gold-50", ring: "ring-cr-gold-100" },
  receipts: { icon: "text-cr-green-600", bg: "bg-cr-green-50", ring: "ring-cr-green-100" },
  prizes: { icon: "text-cr-burgundy-600", bg: "bg-cr-burgundy-50", ring: "ring-cr-burgundy-100" },
};

export default function AdminHomePage() {
  const totalUsers = users.length;
  const totalBars = bars.length;
  const receiptsLast30 = receipts.length;
  const redeemedPrizes = 38;

  const currentPeriod = "2026-01";
  const top3 = React.useMemo(() => getAdminRanking(currentPeriod).slice(0, 3), []);

  const max = Math.max(...chartData.map((d) => d.value));

  const stats = [
    { label: "Total de usuários", value: totalUsers, type: "users" as const },
    { label: "Total de bares", value: totalBars, type: "bars" as const },
    { label: "Notas (30 dias)", value: receiptsLast30, type: "receipts" as const },
    { label: "Prêmios resgatados", value: redeemedPrizes, type: "prizes" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">DASHBOARD</h1>
        <p className="mt-1 text-sm text-cr-brown-500">Visão geral do sistema Cliente Raiz</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.type} className="!p-0 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-cr-brown-400">{s.label}</p>
                  <p className="mt-2 text-3xl font-bold text-cr-brown-900 font-display">{s.value}</p>
                </div>
                <div className={["flex h-10 w-10 items-center justify-center rounded-xl ring-1", statColors[s.type].bg, statColors[s.type].ring].join(" ")}>
                  <span className={statColors[s.type].icon}><StatIcon type={s.type} /></span>
                </div>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
          </Card>
        ))}
      </div>

      {/* Chart + Summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-cr-brown-800">Notas por dia</h2>
              <p className="mt-0.5 text-xs text-cr-brown-400">Últimos 7 dias</p>
            </div>
            <Badge variant="neutral">Mock</Badge>
          </div>
          <div className="flex h-52 items-end gap-2">
            {chartData.map((d, i) => (
              <div key={d.day} className="flex w-full flex-col items-center gap-2">
                <div className="text-xs font-bold text-cr-brown-700">{d.value}</div>
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-cr-brown-800 to-cr-brown-600 transition-all duration-300 hover:from-cr-gold-700 hover:to-cr-gold-500 cursor-default"
                  style={{
                    height: `${Math.max(8, Math.round((d.value / max) * 100))}%`,
                  }}
                  title={`${d.day}: ${d.value}`}
                />
                <div className="text-[11px] font-semibold text-cr-brown-400">{d.day}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5">
            <h2 className="text-sm font-bold text-cr-brown-800">Resumo</h2>
            <p className="mt-0.5 text-xs text-cr-brown-400">Indicadores gerais</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-cr-green-200 bg-cr-green-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cr-green-700">Taxa de aprovação</p>
              <p className="mt-1.5 text-2xl font-bold text-cr-green-800 font-display">82%</p>
            </div>
            <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cr-brown-400">Tempo médio análise</p>
              <p className="mt-1.5 text-2xl font-bold text-cr-brown-800 font-display">1d 4h</p>
            </div>
            <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-cr-brown-400">Bares ativos</p>
              <p className="mt-1.5 text-2xl font-bold text-cr-brown-800 font-display">
                {bars.filter((b) => b.active).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Ranking + Recent receipts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-cr-brown-800">Ranking Top 3</h2>
              <p className="mt-0.5 text-xs text-cr-brown-400">Este mês</p>
            </div>
            <Link className="text-xs font-bold text-cr-gold-700 hover:text-cr-gold-600 transition-colors" href="/admin/ranking">
              Ver tudo
            </Link>
          </div>

          <div className="space-y-2">
            {top3.map((r) => (
              <div key={r.position} className="flex items-center justify-between rounded-xl border border-cr-brown-100 bg-white p-3.5 transition-shadow hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                    r.position === 1 ? "bg-cr-gold-100 text-cr-gold-800" : r.position === 2 ? "bg-cr-brown-100 text-cr-brown-700" : "bg-cr-brown-50 text-cr-brown-500",
                  ].join(" ")}>
                    #{r.position}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cr-brown-800">{r.userName}</p>
                    <p className="text-xs text-cr-brown-400">{r.points} pts</p>
                  </div>
                </div>
                <Badge variant={r.position === 1 ? "gold" : r.position === 2 ? "success" : "neutral"}>Top {r.position}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-cr-brown-800">Últimas notas</h2>
              <p className="mt-0.5 text-xs text-cr-brown-400">Mais recentes</p>
            </div>
            <Link className="text-xs font-bold text-cr-gold-700 hover:text-cr-gold-600 transition-colors" href="/admin/receipts">
              Ver todas
            </Link>
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
                  <TD className="font-medium">{r.userName}</TD>
                  <TD>{r.barName}</TD>
                  <TD className="whitespace-nowrap font-medium">{formatCurrency(r.amount)}</TD>
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
