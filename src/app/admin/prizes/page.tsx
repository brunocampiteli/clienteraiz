"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { prizes as initialPrizes, type Prize } from "@/lib/mockData";

function positionBadgeVariant(pos: number): "gold" | "neutral" | "warning" | "success" {
  if (pos === 1) return "gold";
  if (pos === 2) return "neutral";
  if (pos === 3) return "warning";
  return "success";
}

function positionLabel(pos: number): string {
  return `${pos}º lugar`;
}

export default function PrizesPage() {
  const [data, setData] = React.useState<Prize[]>(() => initialPrizes);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [emoji, setEmoji] = React.useState("🏆");
  const [topRank, setTopRank] = React.useState<string>("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [period, setPeriod] = React.useState<string>("2026-01");

  function upsertPrizeTopRank(nextTopRank?: number, nextPeriod?: string, ignoreId?: string) {
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

    const nextTopRank = topRank ? Number(topRank) : undefined;
    const nextPeriod = period;
    upsertPrizeTopRank(nextTopRank, nextPeriod, editingId ?? undefined);

    if (editingId) {
      setData((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: trimmed,
                description: description.trim() || undefined,
                emoji: emoji.trim() || "🏆",
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
        description: description.trim() || undefined,
        emoji: emoji.trim() || "🏆",
        period: nextPeriod,
        topRank: nextTopRank,
      };
      setData((prev) => [next, ...prev]);
    }

    resetForm();
  }

  function resetForm() {
    setName("");
    setDescription("");
    setEmoji("🏆");
    setTopRank("");
    setEditingId(null);
  }

  /** Calcula próxima posição disponível no período */
  function getNextPosition(): number {
    const periodPrizes = data.filter((p) => p.period === period && p.topRank);
    if (periodPrizes.length === 0) return 1;
    const maxRank = Math.max(...periodPrizes.map((p) => p.topRank!));
    return maxRank + 1;
  }

  function addNextPosition() {
    const nextPos = getNextPosition();
    setTopRank(String(nextPos));
    setEditingId(null);
    setName("");
    setDescription("");
    setEmoji("🏆");
  }

  const periods = React.useMemo(() => {
    const unique = Array.from(new Set(data.map((p) => p.period)));
    return unique.sort().reverse();
  }, [data]);

  const filtered = React.useMemo(() => {
    return data
      .filter((p) => p.period === period)
      .sort((a, b) => (a.topRank ?? 999) - (b.topRank ?? 999));
  }, [data, period]);

  const rankedCount = filtered.filter((p) => p.topRank).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">
          Prêmios
        </h1>
        <p className="mt-1 text-sm text-cr-brown-500">
          Configure prêmios individuais por posição no ranking
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
              Posições premiadas
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-green-700 font-display">
              {rankedCount}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
      </div>

      {/* Form */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-cr-brown-900">
              {editingId ? "Editar prêmio" : "Novo prêmio"}
            </h2>
            <p className="mt-0.5 text-xs text-cr-brown-400">
              {editingId ? "Altere os campos e salve" : "Preencha os campos para cadastrar"}
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={addNextPosition}>
            + Adicionar posição ({getNextPosition()}º)
          </Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-4">
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
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Posição no ranking
              </label>
              <Input
                type="number"
                min={1}
                value={topRank}
                onChange={(e) => setTopRank(e.target.value)}
                placeholder="Ex.: 1, 2, 3..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Emoji
              </label>
              <Input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🏆"
                className="text-center text-lg"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Nome do prêmio
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Kit Cliente Raiz" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Descrição (opcional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex.: Kit completo com camiseta, copo e abridor"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">{editingId ? "Salvar alterações" : "Cadastrar prêmio"}</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={resetForm}
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
            {period} — {filtered.length} prêmio(s) • {rankedCount} posição(ões) premiada(s)
          </p>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Posição</TH>
              <TH>Emoji</TH>
              <TH>Prêmio</TH>
              <TH>Descrição</TH>
              <TH>Ações</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((p) => (
              <TR key={p.id}>
                <TD>
                  {p.topRank ? (
                    <Badge variant={positionBadgeVariant(p.topRank)}>
                      {positionLabel(p.topRank)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-cr-brown-400">—</span>
                  )}
                </TD>
                <TD className="text-xl">{p.emoji || "🏆"}</TD>
                <TD className="font-medium text-cr-brown-900">{p.name}</TD>
                <TD className="max-w-[240px] truncate text-sm text-cr-brown-500" title={p.description}>
                  {p.description || "—"}
                </TD>
                <TD>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(p.id);
                        setName(p.name);
                        setDescription(p.description ?? "");
                        setEmoji(p.emoji ?? "🏆");
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
                        if (editingId === p.id) resetForm();
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
                <TD colSpan={5} className="py-10 text-center text-sm text-cr-brown-400">
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
