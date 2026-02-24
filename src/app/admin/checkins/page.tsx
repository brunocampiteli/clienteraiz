"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { checkins as initialCheckins, type CheckIn } from "@/lib/mockData";

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

const statusLabels: Record<CheckIn["status"], string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

const statusVariants: Record<CheckIn["status"], "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function AdminCheckinsPage() {
  const [data, setData] = React.useState<CheckIn[]>(() => initialCheckins);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [selected, setSelected] = React.useState<CheckIn | null>(null);
  const [rejectReason, setRejectReason] = React.useState("");

  const filtered = React.useMemo(() => {
    return data.filter((c) => {
      const matchesSearch =
        !search ||
        c.userName.toLowerCase().includes(search.toLowerCase()) ||
        c.barName.toLowerCase().includes(search.toLowerCase()) ||
        (c.instagramHandle ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  function approve(id: string) {
    setData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "approved" as const } : c,
      ),
    );
    setSelected(null);
  }

  function reject(id: string) {
    setData((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "rejected" as const,
              rejectionReason: rejectReason.trim() || "Motivo não informado",
            }
          : c,
      ),
    );
    setRejectReason("");
    setSelected(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">
          Check-ins Instagram
        </div>
        <div className="mt-1 text-sm text-cr-brown-600">
          Modere os check-ins enviados pelos usuários
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-4">
          <div className="text-2xl font-bold text-cr-gold-600 font-display">
            {data.filter((c) => c.status === "pending").length}
          </div>
          <div className="text-xs text-cr-brown-500">Pendentes</div>
        </Card>
        <Card className="!p-4">
          <div className="text-2xl font-bold text-cr-green-700 font-display">
            {data.filter((c) => c.status === "approved").length}
          </div>
          <div className="text-xs text-cr-brown-500">Aprovados</div>
        </Card>
        <Card className="!p-4">
          <div className="text-2xl font-bold text-cr-brown-500 font-display">
            {data.length}
          </div>
          <div className="text-xs text-cr-brown-500">Total</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Buscar por usuário, bar ou @instagram..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-md border border-cr-brown-100 bg-white px-3 text-sm text-cr-brown-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <THead>
            <TR>
              <TH>Data</TH>
              <TH>Usuário</TH>
              <TH>Bar</TH>
              <TH>Instagram</TH>
              <TH>Pontos</TH>
              <TH>Status</TH>
              <TH>Ações</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((c) => (
              <TR key={c.id}>
                <TD className="whitespace-nowrap text-sm text-cr-brown-600">
                  {formatDate(c.date)}
                </TD>
                <TD className="font-medium text-cr-brown-900">{c.userName}</TD>
                <TD className="text-sm text-cr-brown-600">{c.barName}</TD>
                <TD className="text-sm text-cr-brown-500 font-mono text-xs">
                  {c.instagramHandle || "—"}
                </TD>
                <TD className="whitespace-nowrap font-medium">+{c.points}</TD>
                <TD>
                  <Badge variant={statusVariants[c.status]}>
                    {statusLabels[c.status]}
                  </Badge>
                </TD>
                <TD>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelected(c);
                      setRejectReason("");
                    }}
                  >
                    Ver
                  </Button>
                </TD>
              </TR>
            ))}
            {filtered.length === 0 && (
              <TR>
                <TD colSpan={7} className="py-8 text-center text-sm text-cr-brown-400">
                  Nenhum check-in encontrado
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="absolute inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-base font-bold text-cr-brown-900 font-display">
                Check-in #{selected.id}
              </div>
              <button
                type="button"
                className="text-cr-brown-400 hover:text-cr-brown-600 text-xl cursor-pointer"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-cr-brown-400">Usuário</div>
                  <div className="font-medium text-cr-brown-900">{selected.userName}</div>
                </div>
                <div>
                  <div className="text-xs text-cr-brown-400">Bar</div>
                  <div className="font-medium text-cr-brown-900">{selected.barName}</div>
                </div>
                <div>
                  <div className="text-xs text-cr-brown-400">Data</div>
                  <div className="font-medium text-cr-brown-900">{formatDate(selected.date)}</div>
                </div>
                <div>
                  <div className="text-xs text-cr-brown-400">Instagram</div>
                  <div className="font-medium text-cr-brown-900">
                    {selected.instagramHandle || "Não informado"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-cr-brown-400">Pontos</div>
                  <div className="font-bold text-cr-green-700">+{selected.points}</div>
                </div>
                <div>
                  <div className="text-xs text-cr-brown-400">Status</div>
                  <Badge variant={statusVariants[selected.status]}>
                    {statusLabels[selected.status]}
                  </Badge>
                </div>
              </div>

              {selected.rejectionReason && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Motivo: {selected.rejectionReason}
                </div>
              )}

              {/* Image */}
              <div className="overflow-hidden rounded-xl border border-cr-brown-100">
                <Image
                  src={selected.imageUrl}
                  alt="Print do story"
                  width={600}
                  height={400}
                  className="h-64 w-full object-cover"
                  unoptimized
                />
              </div>

              {/* Actions */}
              {selected.status === "pending" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-cr-brown-600">
                      Motivo da rejeição (se rejeitar)
                    </label>
                    <Input
                      placeholder="Ex.: Story não mostra marcação do bar"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => approve(selected.id)}
                    >
                      Aprovar (+{selected.points} pts)
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 !text-red-600 hover:!bg-red-50"
                      onClick={() => reject(selected.id)}
                    >
                      Rejeitar
                    </Button>
                  </div>
                </div>
              )}

              {selected.status !== "pending" && (
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setSelected(null)}
                  >
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
