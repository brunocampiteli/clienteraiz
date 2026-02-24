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
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">Prêmios</div>
        <div className="mt-1 text-sm text-cr-brown-600">Cadastro e catálogo (mock)</div>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-4">
          <div>
            <div className="mb-1 text-xs font-medium text-cr-brown-600">Mês/ano</div>
            <select
              className="h-10 w-full rounded-md border border-cr-brown-100 bg-white px-3 text-sm text-cr-brown-900"
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
            <div className="mb-1 text-xs font-medium text-cr-brown-600">Nome do prêmio</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Vale chopp" />
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-cr-brown-600">Top (opcional)</div>
            <select
              className="h-10 w-full rounded-md border border-cr-brown-100 bg-white px-3 text-sm text-cr-brown-900"
              value={topRank}
              onChange={(e) => setTopRank(e.target.value)}
            >
              <option value="">—</option>
              <option value="1">Top 1</option>
              <option value="2">Top 2</option>
              <option value="3">Top 3</option>
            </select>
          </div>
          <div className="lg:col-span-4 flex items-center gap-2">
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

      <Card>
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
                    <Badge variant={p.topRank === 1 ? "success" : p.topRank === 2 ? "neutral" : "warning"}>
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
                      variant="ghost"
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
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
