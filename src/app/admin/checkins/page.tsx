"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { checkins as initialCheckins, type CheckIn, bars } from "@/lib/mockData";
import { useRoutes } from "@/lib/context/RouteContext";

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

function GpsBadge({ status, distance }: { status?: string; distance?: number }) {
  if (status === "match") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-cr-green-700">
        <span className="inline-block h-2 w-2 rounded-full bg-cr-green-500" />
        GPS OK {distance != null && `(${distance}m)`}
      </span>
    );
  }
  if (status === "no_match") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-cr-gold-700">
        <span className="inline-block h-2 w-2 rounded-full bg-cr-gold-500" />
        Longe {distance != null && `(${distance}m)`}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-cr-brown-400">
      <span className="inline-block h-2 w-2 rounded-full bg-cr-brown-300" />
      Sem GPS
    </span>
  );
}

// Map user names to IDs for mock route triggers
const USER_NAME_TO_ID: Record<string, string> = {
  "Ana Paula": "app_usr_1",
  "Bruno Lima": "usr_2",
  "Carla Souza": "usr_3",
  "Diego Fernandes": "usr_4",
};

export default function AdminCheckinsPage() {
  const { onBarVisitTriggered } = useRoutes();
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
    const checkin = data.find((c) => c.id === id);
    setData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "approved" as const } : c,
      ),
    );
    if (checkin) {
      const userId = USER_NAME_TO_ID[checkin.userName];
      const barId = checkin.barId;
      if (userId && barId) {
        onBarVisitTriggered(userId, barId);
      }
    }
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

  // Get bar info for selected checkin
  const selectedBar = React.useMemo(() => {
    if (!selected) return null;
    return bars.find((b) => b.id === selected.barId) ?? null;
  }, [selected]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">
          Check-ins Instagram
        </h1>
        <p className="mt-1 text-sm text-cr-brown-500">
          Modere os check-ins com verificação GPS + Instagram
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Pendentes
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-gold-600 font-display">
              {data.filter((c) => c.status === "pending").length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Aprovados
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-green-700 font-display">
              {data.filter((c) => c.status === "approved").length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Total
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-brown-700 font-display">
              {data.length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
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
            className="admin-select"
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
              <TH>GPS</TH>
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
                <TD className="font-mono text-xs text-cr-brown-500">
                  {c.instagramHandle || "—"}
                </TD>
                <TD>
                  <GpsBadge status={c.gpsMatchStatus} distance={c.distanceMeters} />
                </TD>
                <TD className="whitespace-nowrap font-medium text-cr-green-700">+{c.points}</TD>
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
                <TD colSpan={8} className="py-10 text-center text-sm text-cr-brown-400">
                  Nenhum check-in encontrado
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cr-brown-950/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto rounded-2xl border border-cr-brown-100 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-cr-brown-900 font-display">
                Check-in #{selected.id}
              </h2>
              <button
                type="button"
                className="rounded-lg p-1 text-cr-brown-400 transition-colors hover:bg-cr-brown-50 hover:text-cr-brown-600 cursor-pointer"
                onClick={() => setSelected(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Usuário</div>
                  <div className="mt-0.5 font-medium text-cr-brown-900">{selected.userName}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Bar</div>
                  <div className="mt-0.5 font-medium text-cr-brown-900">{selected.barName}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Data</div>
                  <div className="mt-0.5 font-medium text-cr-brown-900">{formatDate(selected.date)}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Instagram do usuário</div>
                  <div className="mt-0.5 font-medium text-cr-brown-900">
                    {selected.instagramHandle || "Não informado"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Pontos</div>
                  <div className="mt-0.5 font-bold text-cr-green-700">+{selected.points}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Status</div>
                  <div className="mt-1">
                    <Badge variant={statusVariants[selected.status]}>
                      {statusLabels[selected.status]}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* GPS Verification Section */}
              <div className={[
                "rounded-xl border p-4",
                selected.gpsMatchStatus === "match"
                  ? "border-cr-green-200 bg-cr-green-50"
                  : selected.gpsMatchStatus === "no_match"
                  ? "border-cr-gold-200 bg-cr-gold-50"
                  : "border-cr-brown-100 bg-cr-brown-50",
              ].join(" ")}>
                <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500 mb-2">
                  Verificação GPS
                </div>
                <div className="flex items-center justify-between">
                  <GpsBadge status={selected.gpsMatchStatus} distance={selected.distanceMeters} />
                  {selectedBar?.instagramHandle && (
                    <span className="text-xs text-cr-brown-500">
                      Instagram do bar: <span className="font-mono font-semibold">{selectedBar.instagramHandle}</span>
                    </span>
                  )}
                </div>
                {(selected.userLatitude != null || selectedBar?.latitude != null) && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-cr-brown-400">
                    <div>
                      <span className="font-semibold">Usuário:</span>{" "}
                      {selected.userLatitude != null
                        ? `${selected.userLatitude.toFixed(4)}, ${selected.userLongitude?.toFixed(4)}`
                        : "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Bar:</span>{" "}
                      {selectedBar?.latitude != null
                        ? `${selectedBar.latitude.toFixed(4)}, ${selectedBar.longitude?.toFixed(4)}`
                        : "N/A"}
                    </div>
                  </div>
                )}
              </div>

              {selected.rejectionReason && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span className="font-medium">Motivo:</span> {selected.rejectionReason}
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
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                      Motivo da rejeição (se rejeitar)
                    </label>
                    <Input
                      placeholder="Ex.: Story não mostra marcação do bar"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => approve(selected.id)}
                    >
                      Aprovar (+{selected.points} pts)
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
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
