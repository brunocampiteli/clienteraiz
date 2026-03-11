"use client";

import * as React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { receipts, type Receipt, bars } from "@/lib/mockData";
import { addNotification } from "@/lib/notifications";
import { useRoutes } from "@/lib/context/RouteContext";

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

function reasonLabel(reason?: string) {
  if (!reason) return "—";
  if (reason === "DUPLICATE_ACCESS_KEY") return "Chave duplicada";
  if (reason === "CNPJ_MISMATCH") return "CNPJ não confere";
  if (reason === "INVALID_OR_CANCELED") return "Nota inválida/cancelada";
  if (reason === "PROVIDER_UNAVAILABLE") return "Consulta indisponível";
  if (reason === "UNREADABLE_QR") return "QR ilegível";
  return reason;
}

function normalizeDigits(v?: string) {
  if (!v) return "";
  return v.replace(/\D/g, "");
}

// Map user names to IDs and bar names to bar IDs for mock route triggers
const USER_NAME_TO_ID: Record<string, string> = {
  "Ana Paula": "app_usr_1",
  "Bruno Lima": "usr_2",
  "Carla Souza": "usr_3",
  "Diego Fernandes": "usr_4",
};

function findBarIdByName(barName: string): string | null {
  const bar = bars.find((b) => b.name === barName);
  return bar?.id ?? null;
}

export default function ReceiptsPage() {
  const { onBarVisitTriggered } = useRoutes();
  const [data, setData] = React.useState(() => receipts);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [reasonFilter, setReasonFilter] = React.useState<string>("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [manualRejectReason, setManualRejectReason] = React.useState<Receipt["reason"]>("INVALID_OR_CANCELED");

  const selected = React.useMemo(() => {
    if (!selectedId) return null;
    return data.find((r) => r.id === selectedId) ?? null;
  }, [data, selectedId]);

  React.useEffect(() => {
    if (!selected) return;
    setManualRejectReason(selected.reason ?? "INVALID_OR_CANCELED");
  }, [selected]);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return data.filter((r) => {
      if (statusFilter && r.status !== statusFilter) return false;
      if (reasonFilter && r.reason !== reasonFilter) return false;
      if (!query) return true;
      return (
        r.userName.toLowerCase().includes(query) ||
        r.barName.toLowerCase().includes(query) ||
        r.status.toLowerCase().includes(query) ||
        (r.accessKey ?? "").toLowerCase().includes(query)
      );
    });
  }, [data, q, reasonFilter, statusFilter]);

  const statusOptions = React.useMemo(() => {
    const unique = Array.from(new Set(data.map((r) => r.status)));
    return unique.sort();
  }, [data]);

  const reasonOptions = React.useMemo(() => {
    const unique = Array.from(new Set(data.map((r) => r.reason).filter(Boolean)));
    return (unique as string[]).sort();
  }, [data]);

  function updateReceipt(id: string, patch: Partial<Receipt>) {
    setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">Notas enviadas</h1>
        <p className="mt-1 text-sm text-cr-brown-500">Fila de validação (QR) e auditoria</p>
      </div>

      {/* Filters + Table */}
      <Card>
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="w-full">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Busca</label>
              <Input
                placeholder="Usuário, bar, status ou chave..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Status</label>
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Motivo</label>
              <select
                className="admin-select"
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              >
                <option value="">Todos</option>
                {reasonOptions.map((s) => (
                  <option key={s} value={s}>
                    {reasonLabel(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="whitespace-nowrap text-sm font-medium text-cr-brown-500">{filtered.length} resultado(s)</span>
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setQ("");
                setStatusFilter("");
                setReasonFilter("");
              }}
            >
              Limpar
            </Button>
          </div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Data</TH>
              <TH>Usuário</TH>
              <TH>Bar</TH>
              <TH>Valor</TH>
              <TH>Status</TH>
              <TH>Motivo</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR
                key={r.id}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedId(r.id);
                }}
              >
                <TD className="whitespace-nowrap">{r.date}</TD>
                <TD>{r.userName}</TD>
                <TD>{r.barName}</TD>
                <TD className="whitespace-nowrap font-medium">{formatCurrency(r.amount)}</TD>
                <TD>{statusBadge(r.status)}</TD>
                <TD className="whitespace-nowrap text-sm text-cr-brown-500">{reasonLabel(r.reason)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      {/* Detail modal */}
      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-cr-brown-950/60 backdrop-blur-sm p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <div className="w-full max-w-3xl rounded-2xl border border-cr-brown-100 bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between gap-3 border-b border-cr-brown-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-cr-brown-900 font-display">Detalhe da nota</h2>
                <p className="mt-1 text-sm text-cr-brown-500">
                  {selected.userName} &bull; {selected.barName} &bull; {selected.date}
                </p>
              </div>
              <Button variant="ghost" type="button" onClick={() => setSelectedId(null)}>
                Fechar
              </Button>
            </div>

            {/* Modal body */}
            <div className="grid gap-5 p-6 lg:grid-cols-2">
              {/* Left column - Details & Actions */}
              <div className="space-y-4">
                {/* Status box */}
                <div className="rounded-xl border border-cr-brown-100 bg-cr-brown-50 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Status</span>
                  <div className="mt-2">{statusBadge(selected.status)}</div>
                  <p className="mt-3 text-xs text-cr-brown-500">Motivo: {reasonLabel(selected.reason)}</p>
                </div>

                {/* Access key box */}
                <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Chave (access key)</span>
                  <div className="mt-2 break-all font-mono text-xs text-cr-brown-900">{selected.accessKey ?? "—"}</div>
                </div>

                {/* CNPJ box */}
                <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">CNPJ do bar</span>
                      <div className="mt-2 font-mono text-xs text-cr-brown-900">{selected.barCnpj ?? "—"}</div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">CNPJ emitente</span>
                      <div className="mt-2 font-mono text-xs text-cr-brown-900">{selected.issuerCnpj ?? "—"}</div>
                    </div>
                  </div>
                  {selected.barCnpj && selected.issuerCnpj ? (
                    <div className="mt-3 flex items-center gap-1.5 text-xs">
                      {normalizeDigits(selected.barCnpj) === normalizeDigits(selected.issuerCnpj) ? (
                        <Badge variant="success">Confere</Badge>
                      ) : (
                        <Badge variant="danger">Não confere</Badge>
                      )}
                    </div>
                  ) : null}
                </div>

                {/* Value & Manual actions box */}
                <div className="rounded-xl border border-cr-brown-100 bg-white p-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Valor</span>
                  <div className="mt-2 text-xl font-bold tracking-tight text-cr-brown-900 font-display">{formatCurrency(selected.amount)}</div>

                  <div className="mt-4 rounded-lg border border-cr-gold-200 bg-cr-gold-50 px-3 py-2">
                    <p className="text-xs font-medium text-cr-brown-600">Ação manual (mock): usar apenas em exceções</p>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Motivo (ao rejeitar)</label>
                    <select
                      className="admin-select"
                      value={manualRejectReason}
                      onChange={(e) => setManualRejectReason(e.target.value as Receipt["reason"])}
                    >
                      <option value="INVALID_OR_CANCELED">{reasonLabel("INVALID_OR_CANCELED")}</option>
                      <option value="CNPJ_MISMATCH">{reasonLabel("CNPJ_MISMATCH")}</option>
                      <option value="DUPLICATE_ACCESS_KEY">{reasonLabel("DUPLICATE_ACCESS_KEY")}</option>
                      <option value="UNREADABLE_QR">{reasonLabel("UNREADABLE_QR")}</option>
                      <option value="PROVIDER_UNAVAILABLE">{reasonLabel("PROVIDER_UNAVAILABLE")}</option>
                    </select>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        updateReceipt(selected.id, {
                          status: "approved",
                          reason: undefined,
                          issuerCnpj: selected.issuerCnpj ?? selected.barCnpj,
                        });
                        addNotification({
                          type: "receipt_approved",
                          title: "Nota aprovada 🎉",
                          body: `${selected.barName} • ${formatCurrency(selected.amount)}`,
                          href: "/app/points",
                        });
                        // Trigger route bar visit
                        const userId = USER_NAME_TO_ID[selected.userName];
                        const barId = findBarIdByName(selected.barName);
                        if (userId && barId) {
                          onBarVisitTriggered(userId, barId);
                        }
                        setSelectedId(null);
                      }}
                    >
                      Aprovar
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        updateReceipt(selected.id, {
                          status: "rejected",
                          reason: manualRejectReason,
                        });
                        setSelectedId(null);
                      }}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        updateReceipt(selected.id, {
                          status: "pending_validation",
                          reason: "UNREADABLE_QR",
                        });
                        setSelectedId(null);
                      }}
                    >
                      Solicitar reenvio
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        updateReceipt(selected.id, {
                          status: "needs_review",
                          reason: selected.reason,
                        });
                        setSelectedId(null);
                      }}
                    >
                      Marcar como revisada
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right column - Image */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Imagem (evidência)</span>
                <div className="overflow-hidden rounded-xl border border-cr-brown-100 bg-cr-brown-50">
                  {selected.imageUrl ? (
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={selected.imageUrl}
                        alt={`Nota ${selected.id}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center text-sm text-cr-brown-400">Sem imagem</div>
                  )}
                </div>
                <p className="text-xs text-cr-brown-400">
                  A imagem só carrega ao abrir o detalhe (não pesa a listagem).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
