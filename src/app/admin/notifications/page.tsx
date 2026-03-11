"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";

type SentNotification = {
  id: string;
  title: string;
  body: string;
  url: string;
  sentAt: string;
  recipientCount: number;
  status: "sent" | "error";
};

export default function AdminNotificationsPage() {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [url, setUrl] = React.useState("/app");
  const [sending, setSending] = React.useState(false);
  const [history, setHistory] = React.useState<SentNotification[]>([]);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSending(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          url: url.trim() || "/app",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setHistory((prev) => [
          {
            id: `push_${Date.now()}`,
            title: title.trim(),
            body: body.trim(),
            url: url.trim() || "/app",
            sentAt: new Date().toISOString(),
            recipientCount: data.sent ?? 0,
            status: "sent",
          },
          ...prev,
        ]);
        setFeedback({
          type: "success",
          message: `Notificação enviada para ${data.sent} assinante(s)${data.failed ? ` (${data.failed} falha(s))` : ""}`,
        });
        setTitle("");
        setBody("");
        setUrl("/app");
      } else {
        setFeedback({
          type: "error",
          message: data.error || "Erro ao enviar notificação",
        });
      }
    } catch {
      setFeedback({ type: "error", message: "Falha na conexão com o servidor" });
    } finally {
      setSending(false);
    }
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">
          Notificações Push
        </h1>
        <p className="mt-1 text-sm text-cr-brown-500">
          Envie notificações push para os celulares dos usuários
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Enviadas (sessão)
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-gold-600 font-display">
              {history.length}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
        <Card className="!p-0 overflow-hidden">
          <div className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Total destinatários
            </div>
            <div className="mt-1 text-3xl font-bold text-cr-green-700 font-display">
              {history.reduce((sum, n) => sum + n.recipientCount, 0)}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-cr-gold-400 via-cr-gold-500 to-cr-gold-300 opacity-60" />
        </Card>
      </div>

      {/* Compose form */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-cr-brown-900">Nova notificação</h2>
          <p className="mt-0.5 text-xs text-cr-brown-400">Preencha os campos e envie</p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-6">
          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Título *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Novo desafio disponível!"
              required
            />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              URL de destino
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/app"
            />
          </div>

          <div className="lg:col-span-6">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
              Mensagem
            </label>
            <Input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Corpo da notificação (opcional)"
            />
          </div>

          <div className="lg:col-span-6 flex items-center gap-3">
            <Button type="submit" disabled={sending || !title.trim()}>
              {sending ? "Enviando…" : "Enviar notificação"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setTitle("");
                setBody("");
                setUrl("/app");
                setFeedback(null);
              }}
            >
              Limpar
            </Button>
          </div>

          {feedback && (
            <div className="lg:col-span-6">
              <div
                className={
                  feedback.type === "success"
                    ? "rounded-xl border border-cr-green-200 bg-cr-green-50 px-4 py-3 text-sm text-cr-green-800"
                    : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                }
              >
                {feedback.message}
              </div>
            </div>
          )}
        </form>
      </Card>

      {/* Sent history */}
      <Card>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-cr-brown-900">
            Histórico de envios
          </h2>
          <p className="mt-0.5 text-xs text-cr-brown-400">
            Notificações enviadas nesta sessão
          </p>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-cr-brown-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="mt-2 text-sm text-cr-brown-400">Nenhuma notificação enviada ainda</p>
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Data/Hora</TH>
                <TH>Título</TH>
                <TH>Mensagem</TH>
                <TH>Destino</TH>
                <TH>Assinantes</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {history.map((n) => (
                <TR key={n.id}>
                  <TD className="whitespace-nowrap text-sm text-cr-brown-600">
                    {formatDate(n.sentAt)}
                  </TD>
                  <TD>
                    <div className="font-medium text-cr-brown-900">
                      {n.title}
                    </div>
                  </TD>
                  <TD className="text-sm text-cr-brown-600">
                    {n.body || "—"}
                  </TD>
                  <TD className="font-mono text-xs text-cr-brown-500">
                    {n.url}
                  </TD>
                  <TD className="whitespace-nowrap font-medium text-cr-brown-900">{n.recipientCount}</TD>
                  <TD>
                    {n.status === "sent" ? (
                      <Badge variant="success">Enviado</Badge>
                    ) : (
                      <Badge variant="danger">Erro</Badge>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
