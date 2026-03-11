"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { prizes as initialPrizes, type Prize } from "@/lib/mockData";

export default function PrizesPage() {
  const [data, setData] = React.useState<Prize[]>(() => initialPrizes);
  const [name, setName] = React.useState("");
  const [topRank, setTopRank] = React.useState<string>("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [period, setPeriod] = React.useState<string>("2026-01");

  function upsertPrizeTopRank(nextTopRank?: 1 | 2 | 3, nextPeriod?: string, ignoreId?: string) {
    if (!nextTopRank) return;
    if (!nextPeriod) return;
    setData((prev) =>
      prev.map((p) => {
        if (ignoreId && p.id === ignoreId) return p;
        return p.period === nextPeriod && p.topRank === nextTopRank ? { ...p, topRank: undefined } : p;
      })
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) return;

    const nextTopRank = topRank ? (Number(topRank) as 1 | 2 | 3) : undefined;
    const nextPeriod = period;
    upsertPrizeTopRank(nextTopRank, nextPeriod, editingId ?? undefined);

    if (editingId) {
      setData((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: trimmed,
                period: nextPeriod,
                topRank: nextTopRank,
              }
            : p
        )
      );
    } else {
      const next: Prize = {
        id: `prize_${Date.now()}`,
        name: trimmed,
        period: nextPeriod,
        topRank: nextTopRank,
      };
      setData((prev) => [next, ...prev]);
    }

    setName("");
    setTopRank("");
    setEditingId(null);
  }

  const periods = React.useMemo(() => {
    const unique = Array.from(new Set(data.map((p) => p.period)));
    return unique.sort().reverse();
  }, [data]);

  const filtered = React.useMemo(() => {
    return data.filter((p) => p.period === period);
  }, [data, period]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">
          Prêmios
        </h1>
        <p className="mt-1 text-sm text-cr-brown-500">
          Cadastro e catálogo de prêmios por período
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Total cadastrados
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-gold-600 font-display">
              {data.length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Período atual
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-brown-700 font-display">
              {filtered.length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Com ranking
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-green-700 font-display">
              {filtered.filter((p) => p.topRank).length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
      </div>

      {/* Form */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-cr-brown-900">
            {editingId ? "Editar prêmio" : "Novo prêmio"}
          </h2>
          <p className="mt-0.5 text-xs text-cr-brown-400">
            {editingId ? "Altere os campos e salve" : "Preencha os campos para cadastrar"}
          </p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Mês/ano
            </label>
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
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Nome do prêmio
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Vale chopp" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Top (opcional)
            </label>
            <select
              className="admin-select"
              value={topRank}
              onChange={(e) => setTopRank(e.target.value)}
            >
              <option value="">—</option>
              <option value="1">Top 1</option>
              <option value="2">Top 2</option>
              <option value="3">Top 3</option>
            </select>
          </div>
          <div className="lg:col-span-4 flex items-center gap-3">
            <Button type="submit">{editingId ? "Salvar alterações" : "Cadastrar prêmio"}</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setName("");
                setTopRank("");
                setEditingId(null);
              }}
            >
              {editingId ? "Cancelar" : "Limpar"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-cr-brown-900">
            Prêmios do período
          </h2>
          <p className="mt-0.5 text-xs text-cr-brown-400">
            {period} — {filtered.length} prêmio(s)
          </p>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Prêmio</TH>
              <TH>Top</TH>
              <TH>Ações</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((p) => (
              <TR key={p.id}>
                <TD className="font-medium text-cr-brown-900">{p.name}</TD>
                <TD>
                  {p.topRank ? (
                    <Badge variant={p.topRank === 1 ? "gold" : p.topRank === 2 ? "neutral" : "warning"}>
                      Top {p.topRank}
                    </Badge>
                  ) : (
                    <span className="text-sm text-cr-brown-400">—</span>
                  )}
                </TD>
                <TD>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(p.id);
                        setName(p.name);
                        setTopRank(p.topRank ? String(p.topRank) : "");
                        setPeriod(p.period);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        setData((prev) => prev.filter((x) => x.id !== p.id));
                        if (editingId === p.id) {
                          setEditingId(null);
                          setName("");
                          setTopRank("");
                        }
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
            {filtered.length === 0 && (
              <TR>
                <TD colSpan={3} className="py-10 text-center text-sm text-cr-brown-400">
                  Nenhum prêmio cadastrado neste período
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
