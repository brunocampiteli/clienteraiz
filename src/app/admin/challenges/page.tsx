"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { bars, challenges as initialChallenges, type Challenge } from "@/lib/mockData";
import { addNotification } from "@/lib/notifications";

export default function ChallengesPage() {
  const [data, setData] = React.useState<Challenge[]>(() => initialChallenges);

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [week, setWeek] = React.useState("2026-W04");
  const [appliesToAllBars, setAppliesToAllBars] = React.useState(true);
  const [barIds, setBarIds] = React.useState<string[]>([]);
  const [rewardName, setRewardName] = React.useState("");
  const [rankingPoints, setRankingPoints] = React.useState<string>("150");
  const [active, setActive] = React.useState(true);

  const weeks = React.useMemo(() => {
    const unique = Array.from(new Set(data.map((c) => c.week)));
    return unique.sort().reverse();
  }, [data]);

  const [weekFilter, setWeekFilter] = React.useState<string>(week);

  React.useEffect(() => {
    if (!weeks.includes(weekFilter) && weeks.length > 0) setWeekFilter(weeks[0]);
  }, [weekFilter, weeks]);

  const filtered = React.useMemo(() => {
    return data.filter((c) => (weekFilter ? c.week === weekFilter : true));
  }, [data, weekFilter]);

  React.useEffect(() => {
    if (!appliesToAllBars) return;
    setBarIds([]);
  }, [appliesToAllBars]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setWeek(weekFilter || "2026-W04");
    setAppliesToAllBars(true);
    setBarIds([]);
    setRewardName("");
    setRankingPoints("150");
    setActive(true);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const trimmedWeek = week.trim();
    const trimmedReward = rewardName.trim();
    const parsedPoints = Number(rankingPoints);

    if (!trimmedTitle) return;
    if (!trimmedWeek) return;

    const next: Challenge = {
      id: editingId ?? `ch_${Date.now()}`,
      title: trimmedTitle,
      description: trimmedDesc,
      week: trimmedWeek,
      appliesToAllBars,
      barIds: appliesToAllBars ? [] : barIds,
      rewardName: trimmedReward,
      rankingPoints: Number.isFinite(parsedPoints) ? Math.max(0, parsedPoints) : 0,
      active,
    };

    setData((prev) => {
      const exists = prev.some((c) => c.id === next.id);
      if (!exists) return [next, ...prev];
      return prev.map((c) => (c.id === next.id ? next : c));
    });

    addNotification({
      type: "new_challenge",
      title: "Novo desafio",
      body: next.title,
      href: "/app/treasure",
    });

    if (trimmedWeek) setWeekFilter(trimmedWeek);

    resetForm();
  }

  function toggleBar(id: string) {
    setBarIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function barLabels(ids: string[]) {
    if (ids.length === 0) return "—";
    const map = new Map(bars.map((b) => [b.id, b.name]));
    return ids
      .map((id) => map.get(id))
      .filter(Boolean)
      .join(", ");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">Desafios</h1>
        <p className="mt-1 text-sm text-cr-brown-500">Cadastro de desafios semanais (mock)</p>
      </div>

      <Card>
        <div className="mb-5 text-sm font-bold text-cr-brown-900 font-display">
          {editingId ? "Editar desafio" : "Novo desafio"}
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Semana</label>
            <Input value={week} onChange={(e) => setWeek(e.target.value)} placeholder="Ex.: 2026-W04" />
          </div>
          <div className="lg:col-span-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Visite 3 bares diferentes essa semana" />
          </div>

          <div className="lg:col-span-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Descrição</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes do desafio..." />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Recompensa (independente do ranking)</label>
            <Input value={rewardName} onChange={(e) => setRewardName(e.target.value)} placeholder="Ex.: Vale petiscos" />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Pontos para o ranking (opcional)</label>
            <Input value={rankingPoints} onChange={(e) => setRankingPoints(e.target.value)} placeholder="0" inputMode="numeric" />
          </div>

          <div className="lg:col-span-2 flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-cr-brown-600 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="rounded" />
              Ativo
            </label>
            <label className="flex items-center gap-2 text-sm text-cr-brown-600 cursor-pointer">
              <input
                type="checkbox"
                checked={appliesToAllBars}
                onChange={(e) => setAppliesToAllBars(e.target.checked)}
                className="rounded"
              />
              Todos os bares
            </label>
          </div>

          <div className="lg:col-span-6">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Bares participantes</label>
            <div className={"rounded-xl border border-cr-brown-100 bg-white p-4 " + (appliesToAllBars ? "opacity-50" : "")}
              aria-disabled={appliesToAllBars}
            >
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {bars.map((b) => (
                  <label key={b.id} className="flex items-center gap-2 text-sm text-cr-brown-600 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={appliesToAllBars}
                      checked={barIds.includes(b.id)}
                      onChange={() => toggleBar(b.id)}
                      className="rounded"
                    />
                    {b.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center gap-2 pt-2">
            <Button type="submit">{editingId ? "Salvar alterações" : "Cadastrar desafio"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {editingId ? "Cancelar" : "Limpar"}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-bold text-cr-brown-900 font-display">Desafios cadastrados</div>
            <p className="mt-1 text-xs text-cr-brown-400">Filtre por semana</p>
          </div>
          <div className="w-full sm:max-w-[220px]">
            <select
              className="admin-select"
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
            >
              <option value="">Todas</option>
              {weeks.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Semana</TH>
              <TH>Desafio</TH>
              <TH>Bares</TH>
              <TH>Recompensa</TH>
              <TH>Pontos ranking</TH>
              <TH>Status</TH>
              <TH>Ações</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((c) => (
              <TR key={c.id}>
                <TD className="whitespace-nowrap font-medium text-cr-brown-900">{c.week}</TD>
                <TD>
                  <div className="font-medium text-cr-brown-900">{c.title}</div>
                  <div className="mt-0.5 text-xs text-cr-brown-500">{c.description || "—"}</div>
                </TD>
                <TD className="text-sm text-cr-brown-600">
                  {c.appliesToAllBars ? <Badge variant="gold">Todos</Badge> : barLabels(c.barIds) || "—"}
                </TD>
                <TD className="text-sm text-cr-brown-600">{c.rewardName || "—"}</TD>
                <TD className="whitespace-nowrap">
                  {c.rankingPoints > 0 ? (
                    <span className="font-semibold text-cr-gold-700">+{c.rankingPoints} pts</span>
                  ) : (
                    <span className="text-cr-brown-400">0</span>
                  )}
                </TD>
                <TD>
                  {c.active ? <Badge variant="success">Ativo</Badge> : <Badge variant="neutral">Inativo</Badge>}
                </TD>
                <TD>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setEditingId(c.id);
                        setTitle(c.title);
                        setDescription(c.description);
                        setWeek(c.week);
                        setAppliesToAllBars(c.appliesToAllBars);
                        setBarIds(c.barIds);
                        setRewardName(c.rewardName);
                        setRankingPoints(String(c.rankingPoints));
                        setActive(c.active);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setData((prev) => prev.filter((x) => x.id !== c.id));
                        if (editingId === c.id) resetForm();
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
