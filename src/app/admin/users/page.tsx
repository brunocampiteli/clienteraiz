"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { users } from "@/lib/mockData";

export default function UsersListPage() {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => {
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.cpf.toLowerCase().includes(query) ||
        u.whatsapp.toLowerCase().includes(query)
      );
    });
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-zinc-900">Usuários</div>
          <div className="mt-1 text-sm text-zinc-600">Lista de usuários cadastrados</div>
        </div>
        <Link href="/admin/users/new">
          <Button>Novo</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <Input placeholder="Buscar por nome, CPF, e-mail ou WhatsApp..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="text-sm text-zinc-600">{filtered.length} resultado(s)</div>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Nome</TH>
              <TH>CPF</TH>
              <TH>E-mail</TH>
              <TH>WhatsApp</TH>
              <TH>Criado em</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((u) => (
              <TR key={u.id}>
                <TD className="font-medium text-zinc-900">{u.name}</TD>
                <TD className="whitespace-nowrap">{u.cpf}</TD>
                <TD>{u.email}</TD>
                <TD className="whitespace-nowrap">{u.whatsapp}</TD>
                <TD className="whitespace-nowrap">{u.createdAt}</TD>
                <TD>
                  {u.status === "active" ? <Badge variant="success">Ativo</Badge> : <Badge variant="danger">Bloqueado</Badge>}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
