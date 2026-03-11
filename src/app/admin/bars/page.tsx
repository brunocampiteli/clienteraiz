"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { bars } from "@/lib/mockData";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function BarsListPage() {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return bars;
    return bars.filter((b) => {
      return (
        b.name.toLowerCase().includes(query) ||
        b.legalName.toLowerCase().includes(query) ||
        b.cnpj.toLowerCase().includes(query) ||
        b.city.toLowerCase().includes(query) ||
        b.state.toLowerCase().includes(query) ||
        b.neighborhood.toLowerCase().includes(query) ||
        b.address.toLowerCase().includes(query)
        || b.cep.toLowerCase().includes(query)
      );
    });
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">Bares</h1>
          <p className="mt-1 text-sm text-cr-brown-500">Gerencie os bares cadastrados na plataforma</p>
        </div>
        <Link href="/admin/bars/new">
          <Button variant="primary">+ Novo Bar</Button>
        </Link>
      </div>

      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-sm">
            <Input placeholder="Buscar por fantasia, CNPJ, cidade, UF, bairro, CEP, endereço..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <span className="text-xs font-medium text-cr-brown-400">{filtered.length} resultado(s)</span>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Fantasia</TH>
              <TH>Razão social</TH>
              <TH>CNPJ</TH>
              <TH>Cidade</TH>
              <TH>UF</TH>
              <TH>Consumo mínimo</TH>
              <TH>Status</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((b) => (
              <TR key={b.id}>
                <TD className="font-medium text-cr-brown-900">{b.name}</TD>
                <TD className="max-w-[320px] truncate" title={b.legalName}>
                  {b.legalName}
                </TD>
                <TD className="whitespace-nowrap">{b.cnpj}</TD>
                <TD>{b.city}</TD>
                <TD>{b.state}</TD>
                <TD className="whitespace-nowrap">{formatCurrency(b.minimumSpend)}</TD>
                <TD>
                  {b.active ? <Badge variant="success">Ativo</Badge> : <Badge variant="neutral">Inativo</Badge>}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
