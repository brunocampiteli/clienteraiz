"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { bars } from "@/lib/mockData";
import { addNotification } from "@/lib/notifications";
import { useRoutes } from "@/lib/context/RouteContext";
import type { RouteDifficulty, RouteInput } from "@/lib/types";

const DURATION_OPTIONS = [
  { value: 3, label: "3 dias" },
  { value: 5, label: "5 dias" },
  { value: 7, label: "7 dias" },
  { value: 10, label: "10 dias" },
  { value: 14, label: "14 dias" },
  { value: 21, label: "21 dias" },
  { value: 30, label: "30 dias" },
];

const DIFFICULTY_OPTIONS: RouteDifficulty[] = ["fácil", "médio", "difícil"];

function daysRemaining(startDate: string, durationDays: number) {
  const end = new Date(startDate);
  end.setDate(end.getDate() + durationDays);
  const diff = end.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function calcEndDate(startDate: string, durationDays: number) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + durationDays);
  return d.toISOString().split("T")[0];
}

export default function AdminRoutesPage() {
  const {
    routes: data,
    getRouteBarIds,
    createRoute,
    editRoute,
    deleteRoute,
  } = useRoutes();

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [barIds, setBarIds] = React.useState<string[]>([]);
  const [durationDays, setDurationDays] = React.useState(7);
  const [startDate, setStartDate] = React.useState(() => new Date().toISOString().split("T")[0]);
  const [prize, setPrize] = React.useState("");
  const [bonusPoints, setBonusPoints] = React.useState("200");
  const [difficulty, setDifficulty] = React.useState<RouteDifficulty>("fácil");
  const [active, setActive] = React.useState(true);

  const [filter, setFilter] = React.useState<"all" | "active" | "inactive">("all");

  const filtered = React.useMemo(() => {
    if (filter === "active") return data.filter((r) => r.active);
    if (filter === "inactive") return data.filter((r) => !r.active);
    return data;
  }, [data, filter]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setBarIds([]);
    setDurationDays(7);
    setStartDate(new Date().toISOString().split("T")[0]);
    setPrize("");
    setBonusPoints("200");
    setDifficulty("fácil");
    setActive(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    if (barIds.length === 0) return;

    const parsedPoints = Number(bonusPoints);

    const input: RouteInput = {
      name: trimmedName,
      description: description.trim(),
      emoji: "🍺",
      difficulty,
      durationDays,
      startDate,
      prize: prize.trim(),
      prizeEmoji: "🏆",
      bonusPoints: Number.isFinite(parsedPoints) ? Math.max(0, parsedPoints) : 0,
      active,
      barIds,
      barPoints: {},
    };

    if (editingId) {
      editRoute(editingId, input);
    } else {
      createRoute(input);
    }

    addNotification({
      type: "new_challenge",
      title: editingId ? "Rota atualizada" : "Nova rota",
      body: trimmedName,
      href: "/app/routes",
    });

    resetForm();
  }

  function toggleBar(id: string) {
    setBarIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function moveBarUp(idx: number) {
    if (idx === 0) return;
    setBarIds((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveBarDown(idx: number) {
    setBarIds((prev) => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function barName(id: string) {
    return bars.find((b) => b.id === id)?.name ?? id;
  }

  function handleEdit(routeId: string) {
    const route = data.find((r) => r.id === routeId);
    if (!route) return;
    const routeBarIds = getRouteBarIds(routeId);

    setEditingId(route.id);
    setName(route.name);
    setDescription(route.description);
    setBarIds(routeBarIds);
    setDurationDays(route.durationDays);
    setStartDate(route.startDate);
    setPrize(route.prize);
    setBonusPoints(String(route.bonusPoints));
    setDifficulty(route.difficulty);
    setActive(route.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(routeId: string) {
    deleteRoute(routeId);
    if (editingId === routeId) resetForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">Rotas</h1>
        <p className="mt-1 text-sm text-cr-brown-500">Cadastre rotas de gamificação com prazo em dias para os usuários completarem</p>
      </div>

      {/* Form */}
      <Card>
        <div className="mb-5 text-sm font-bold text-cr-brown-900 font-display">
          {editingId ? "Editar rota" : "Nova rota"}
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-6">
          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Nome da rota *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Rota do Happy Hour" />
          </div>

          <div className="lg:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Dificuldade</label>
            <select
              className="admin-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as RouteDifficulty)}
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Prazo (dias) *</label>
            <select
              className="admin-select"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
            >
              {DURATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Data início</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="lg:col-span-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Descrição</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva a rota para os usuários..." />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Prêmio</label>
            <Input value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="Ex.: 1 Balde Eisenbahn" />
          </div>

          <div className="lg:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Pontos bônus</label>
            <Input value={bonusPoints} onChange={(e) => setBonusPoints(e.target.value)} placeholder="200" inputMode="numeric" />
          </div>

          <div className="lg:col-span-2 flex items-end">
            <label className="flex items-center gap-2 text-sm text-cr-brown-600 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded" />
              Rota ativa (visível para usuários)
            </label>
          </div>

          {/* Date preview */}
          <div className="lg:col-span-6">
            <div className="rounded-xl bg-cr-gold-50 border border-cr-gold-200 p-3.5 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">📅</span>
                <div>
                  <span className="text-cr-brown-500">Período: </span>
                  <span className="font-bold text-cr-brown-900">{formatDate(startDate)}</span>
                  <span className="text-cr-brown-400"> → </span>
                  <span className="font-bold text-cr-brown-900">{formatDate(calcEndDate(startDate, durationDays))}</span>
                </div>
              </div>
              <Badge variant="gold">{durationDays} dias para completar</Badge>
            </div>
          </div>

          {/* Bars Selection */}
          <div className="lg:col-span-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Bares da rota (selecione e ordene) *</label>
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Bares disponíveis</div>
                <div className="space-y-1.5">
                  {bars.map((b) => {
                    const selected = barIds.includes(b.id);
                    return (
                      <label
                        key={b.id}
                        className={[
                          "flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors",
                          selected ? "bg-cr-gold-50 text-cr-brown-900" : "text-cr-brown-600 hover:bg-cr-brown-50",
                        ].join(" ")}
                      >
                        <input type="checkbox" checked={selected} onChange={() => toggleBar(b.id)} className="rounded" />
                        <span className="font-medium">{b.name}</span>
                        <span className="text-xs text-cr-brown-400">• {b.neighborhood}, {b.city}</span>
                        {!b.active && <Badge variant="danger" className="!text-[9px]">Inativo</Badge>}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                  Ordem da rota ({barIds.length} bar{barIds.length !== 1 ? "es" : ""})
                </div>
                {barIds.length === 0 && (
                  <div className="py-6 text-center text-xs text-cr-brown-400">
                    Selecione bares ao lado para montar a rota
                  </div>
                )}
                <div className="space-y-1.5">
                  {barIds.map((id, idx) => (
                    <div key={`${id}-${idx}`} className="flex items-center gap-2 rounded-lg bg-cr-brown-50 px-3 py-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cr-brown-900 text-[10px] font-bold text-white">
                        {idx + 1}
                      </div>
                      <span className="flex-1 text-sm font-medium text-cr-brown-800">{barName(id)}</span>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => moveBarUp(idx)} className="rounded px-1.5 py-0.5 text-xs text-cr-brown-400 hover:bg-cr-brown-100 hover:text-cr-brown-700 cursor-pointer disabled:opacity-30" disabled={idx === 0}>▲</button>
                        <button type="button" onClick={() => moveBarDown(idx)} className="rounded px-1.5 py-0.5 text-xs text-cr-brown-400 hover:bg-cr-brown-100 hover:text-cr-brown-700 cursor-pointer disabled:opacity-30" disabled={idx === barIds.length - 1}>▼</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center gap-2 pt-2">
            <Button type="submit">{editingId ? "Salvar alterações" : "Cadastrar rota"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {editingId ? "Cancelar" : "Limpar"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Routes Table */}
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-bold text-cr-brown-900 font-display">Rotas cadastradas</div>
            <p className="mt-1 text-xs text-cr-brown-400">{data.length} rota{data.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-1.5">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={[
                  "rounded-xl px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
                  filter === f ? "bg-cr-brown-900 text-white" : "bg-white text-cr-brown-500 border border-cr-brown-100 hover:bg-cr-brown-50",
                ].join(" ")}
              >
                {f === "all" ? "Todas" : f === "active" ? "Ativas" : "Inativas"}
              </button>
            ))}
          </div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Rota</TH>
              <TH>Bares</TH>
              <TH>Prazo</TH>
              <TH>Período</TH>
              <TH>Prêmio</TH>
              <TH>Participantes</TH>
              <TH>Status</TH>
              <TH>Ações</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => {
              const routeBarIds = getRouteBarIds(r.id);
              const days = daysRemaining(r.startDate, r.durationDays);
              return (
                <TR key={r.id}>
                  <TD>
                    <div className="font-medium text-cr-brown-900">{r.name}</div>
                    <div className="mt-0.5 text-xs text-cr-brown-500 max-w-[200px] truncate">{r.description}</div>
                    <div className="mt-1">
                      <Badge variant={r.difficulty === "fácil" ? "success" : r.difficulty === "médio" ? "warning" : "danger"}>
                        {r.difficulty}
                      </Badge>
                    </div>
                  </TD>
                  <TD>
                    <div className="space-y-0.5">
                      {routeBarIds.map((id, i) => (
                        <div key={`${id}-${i}`} className="text-xs text-cr-brown-600">
                          <span className="font-semibold text-cr-gold-700">{i + 1}.</span> {barName(id)}
                        </div>
                      ))}
                    </div>
                  </TD>
                  <TD>
                    <div className="text-sm font-bold text-cr-brown-900">{r.durationDays} dias</div>
                    {r.active && days > 0 && (
                      <div className={["mt-0.5 text-xs font-semibold", days <= 2 ? "text-red-600" : "text-cr-gold-700"].join(" ")}>
                        {days}d restante{days > 1 ? "s" : ""}
                      </div>
                    )}
                    {r.active && days === 0 && (
                      <div className="mt-0.5 text-xs text-red-600 font-bold">Expirou!</div>
                    )}
                  </TD>
                  <TD className="whitespace-nowrap text-sm text-cr-brown-600">
                    <div>{formatDate(r.startDate)}</div>
                    <div className="text-xs text-cr-brown-400">até {formatDate(calcEndDate(r.startDate, r.durationDays))}</div>
                  </TD>
                  <TD>
                    <div className="text-sm text-cr-brown-800">{r.prize || "—"}</div>
                    {r.bonusPoints > 0 && <div className="mt-0.5 text-xs text-cr-gold-700">+{r.bonusPoints} pts</div>}
                  </TD>
                  <TD>
                    <div className="text-sm font-semibold text-cr-brown-900">{r.participantsCount}</div>
                    <div className="text-xs text-cr-green-600">{r.completedCount} concluíram</div>
                  </TD>
                  <TD>
                    {r.active ? <Badge variant="success">Ativa</Badge> : <Badge variant="neutral">Inativa</Badge>}
                  </TD>
                  <TD>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="button" variant="secondary" onClick={() => handleEdit(r.id)}>Editar</Button>
                      <Button type="button" variant="ghost" onClick={() => handleDelete(r.id)}>Remover</Button>
                    </div>
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
