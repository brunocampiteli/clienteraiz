"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import {
  adminAchievements as initialAchievements,
  userAchievementAssignments as initialAssignments,
  conditionTypeLabels,
  users,
  type AdminAchievement,
  type UserAchievementAssignment,
} from "@/lib/mockData";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = React.useState<AdminAchievement[]>(() => initialAchievements);
  const [assignments, setAssignments] = React.useState<UserAchievementAssignment[]>(() => initialAssignments);

  // Form state
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [emoji, setEmoji] = React.useState("🏆");
  const [conditionType, setConditionType] = React.useState("");
  const [conditionValue, setConditionValue] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  // Assignment modal state
  const [managingAchId, setManagingAchId] = React.useState<string | null>(null);
  const [assignUserId, setAssignUserId] = React.useState("");

  // Stats
  const totalAssigned = assignments.length;
  const withCondition = achievements.filter((a) => a.conditionType).length;

  // Filter
  const filtered = React.useMemo(() => {
    if (!search) return achievements;
    const q = search.toLowerCase();
    return achievements.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.emoji.includes(q),
    );
  }, [achievements, search]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEmoji("🏆");
    setConditionType("");
    setConditionValue("");
    setEditingId(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    if (editingId) {
      setAchievements((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                title: trimmed,
                description: description.trim(),
                emoji: emoji.trim() || "🏆",
                conditionType: conditionType || undefined,
                conditionValue: conditionValue ? Number(conditionValue) : undefined,
              }
            : a,
        ),
      );
    } else {
      const next: AdminAchievement = {
        id: `ach_${Date.now()}`,
        title: trimmed,
        description: description.trim(),
        emoji: emoji.trim() || "🏆",
        conditionType: conditionType || undefined,
        conditionValue: conditionValue ? Number(conditionValue) : undefined,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAchievements((prev) => [next, ...prev]);
    }

    resetForm();
  }

  function handleEdit(a: AdminAchievement) {
    setEditingId(a.id);
    setTitle(a.title);
    setDescription(a.description);
    setEmoji(a.emoji);
    setConditionType(a.conditionType ?? "");
    setConditionValue(a.conditionValue != null ? String(a.conditionValue) : "");
  }

  function handleDelete(id: string) {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    setAssignments((prev) => prev.filter((ua) => ua.achievementId !== id));
    if (editingId === id) resetForm();
    if (managingAchId === id) setManagingAchId(null);
  }

  function getUserCountForAch(achId: string) {
    return assignments.filter((ua) => ua.achievementId === achId).length;
  }

  // Assignment management
  const managingAch = React.useMemo(
    () => achievements.find((a) => a.id === managingAchId) ?? null,
    [achievements, managingAchId],
  );

  const assignedUsers = React.useMemo(() => {
    if (!managingAchId) return [];
    return assignments
      .filter((ua) => ua.achievementId === managingAchId)
      .map((ua) => ({
        ...ua,
        userName: users.find((u) => u.id === ua.userId)?.name ?? ua.userId,
      }));
  }, [assignments, managingAchId]);

  const availableUsers = React.useMemo(() => {
    if (!managingAchId) return [];
    const assignedIds = new Set(assignedUsers.map((u) => u.userId));
    return users.filter((u) => !assignedIds.has(u.id));
  }, [assignedUsers, managingAchId]);

  function assignToUser() {
    if (!assignUserId || !managingAchId) return;
    const next: UserAchievementAssignment = {
      id: `ua_${Date.now()}`,
      userId: assignUserId,
      achievementId: managingAchId,
      unlockedAt: new Date().toISOString().split("T")[0],
    };
    setAssignments((prev) => [...prev, next]);
    setAssignUserId("");
  }

  function revokeAssignment(assignmentId: string) {
    setAssignments((prev) => prev.filter((ua) => ua.id !== assignmentId));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">
          Conquistas
        </h1>
        <p className="mt-1 text-sm text-cr-brown-500">
          Gerencie selos de conquista e atribua a usuários
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Total de selos
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-gold-600 font-display">
              {achievements.length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Atribuições
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-green-700 font-display">
              {totalAssigned}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Com condição auto
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-brown-700 font-display">
              {withCondition}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
      </div>

      {/* Form */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-cr-brown-900">
            {editingId ? "Editar conquista" : "Nova conquista"}
          </h2>
          <p className="mt-0.5 text-xs text-cr-brown-400">
            {editingId ? "Altere os campos e salve" : "Preencha os campos para cadastrar um novo selo"}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-4">
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
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Título
              </label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Primeiro Bar" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Condição automática
              </label>
              <select
                className="admin-select"
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
              >
                <option value="">Manual (sem condição)</option>
                {Object.entries(conditionTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Descrição
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: Visitou seu primeiro bar"
              />
            </div>
            {conditionType && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                  Valor da condição
                </label>
                <Input
                  type="number"
                  min={1}
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  placeholder="Ex.: 5"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit">{editingId ? "Salvar alterações" : "Cadastrar conquista"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              {editingId ? "Cancelar" : "Limpar"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Search */}
      <Card>
        <Input
          placeholder="Buscar conquista por título ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-cr-brown-900">Todas as conquistas</h2>
          <p className="mt-0.5 text-xs text-cr-brown-400">
            {filtered.length} conquista(s) cadastrada(s)
          </p>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Emoji</TH>
              <TH>Título</TH>
              <TH>Descrição</TH>
              <TH>Condição</TH>
              <TH>Usuários</TH>
              <TH>Ações</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((a) => (
              <TR key={a.id}>
                <TD className="text-2xl">{a.emoji}</TD>
                <TD className="font-medium text-cr-brown-900">{a.title}</TD>
                <TD className="max-w-[200px] truncate text-sm text-cr-brown-500" title={a.description}>
                  {a.description || "—"}
                </TD>
                <TD>
                  {a.conditionType ? (
                    <Badge variant="gold">
                      {conditionTypeLabels[a.conditionType] ?? a.conditionType} ≥ {a.conditionValue}
                    </Badge>
                  ) : (
                    <span className="text-xs text-cr-brown-400">Manual</span>
                  )}
                </TD>
                <TD>
                  <Badge variant={getUserCountForAch(a.id) > 0 ? "success" : "neutral"}>
                    {getUserCountForAch(a.id)}
                  </Badge>
                </TD>
                <TD>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setManagingAchId(managingAchId === a.id ? null : a.id);
                        setAssignUserId("");
                      }}
                    >
                      {managingAchId === a.id ? "Fechar" : "Gerenciar"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => handleEdit(a)}>
                      Editar
                    </Button>
                    <Button type="button" variant="danger" onClick={() => handleDelete(a.id)}>
                      Excluir
                    </Button>
                  </div>
                </TD>
              </TR>
            ))}
            {filtered.length === 0 && (
              <TR>
                <TD colSpan={6} className="py-10 text-center text-sm text-cr-brown-400">
                  Nenhuma conquista encontrada
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>

      {/* Assignment Panel */}
      {managingAch && (
        <Card>
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{managingAch.emoji}</span>
              <div>
                <h2 className="text-sm font-semibold text-cr-brown-900">
                  Atribuições: {managingAch.title}
                </h2>
                <p className="mt-0.5 text-xs text-cr-brown-400">
                  Gerencie quais usuários possuem esta conquista
                </p>
              </div>
            </div>
          </div>

          {/* Assign new user */}
          <div className="mb-5 flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Atribuir a usuário
              </label>
              <select
                className="admin-select"
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
              >
                <option value="">Selecione um usuário...</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <Button type="button" onClick={assignToUser} disabled={!assignUserId}>
              Atribuir
            </Button>
          </div>

          {/* Current assigned users */}
          {assignedUsers.length > 0 ? (
            <Table>
              <THead>
                <TR>
                  <TH>Usuário</TH>
                  <TH>Data</TH>
                  <TH>Ação</TH>
                </TR>
              </THead>
              <TBody>
                {assignedUsers.map((ua) => (
                  <TR key={ua.id}>
                    <TD className="font-medium text-cr-brown-900">{ua.userName}</TD>
                    <TD className="text-sm text-cr-brown-500">{formatDate(ua.unlockedAt)}</TD>
                    <TD>
                      <Button type="button" variant="danger" onClick={() => revokeAssignment(ua.id)}>
                        Revogar
                      </Button>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          ) : (
            <div className="rounded-xl border border-cr-brown-100 bg-cr-brown-50 px-4 py-6 text-center text-sm text-cr-brown-400">
              Nenhum usuário possui esta conquista ainda
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
