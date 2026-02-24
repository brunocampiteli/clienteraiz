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
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">
          Notificações Push
        </div>
        <div className="mt-1 text-sm text-cr-brown-600">
          Envie notificações push para os celulares dos usuários
        </div>
      </div>

      {/* Compose form */}
      <Card>
        <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-6">
          <div className="lg:col-span-3">
            <div className="mb-1 text-xs font-medium text-cr-brown-600">
              Título *
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Novo desafio disponível!"
              required
            />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-1 text-xs font-medium text-cr-brown-600">
              URL de destino
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/app"
            />
          </div>

          <div className="lg:col-span-6">
            <div className="mb-1 text-xs font-medium text-cr-brown-600">
              Mensagem
            </div>
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
                className={[
                  "rounded-lg border px-3 py-2.5 text-sm",
                  feedback.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700",
                ].join(" ")}
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
          <div className="text-sm font-semibold text-cr-brown-900">
            Histórico de envios
          </div>
          <div className="mt-1 text-xs text-cr-brown-400">
            Notificações enviadas nesta sessão
          </div>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-sm text-cr-brown-400">
            Nenhuma notificação enviada ainda
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
                  <TD className="text-sm text-cr-brown-600 font-mono text-xs">
                    {n.url}
                  </TD>
                  <TD className="whitespace-nowrap">{n.recipientCount}</TD>
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
