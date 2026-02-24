"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function NewBarPage() {
  const router = useRouter();
  const [fantasyName, setFantasyName] = React.useState("");
  const [legalName, setLegalName] = React.useState("");
  const [cnpj, setCnpj] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [neighborhood, setNeighborhood] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [cep, setCep] = React.useState("");
  const [minimumSpend, setMinimumSpend] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !fantasyName.trim() ||
      !legalName.trim() ||
      !cnpj.trim() ||
      !city.trim() ||
      !state.trim() ||
      !neighborhood.trim() ||
      !address.trim() ||
      !cep.trim() ||
      !minimumSpend.trim()
    ) {
      return;
    }

    const minimumSpendNumber = Number(minimumSpend);
    if (!Number.isFinite(minimumSpendNumber) || minimumSpendNumber <= 0) {
      return;
    }

    console.log("[new bar]", {
      name: fantasyName,
      legalName,
      cnpj,
      city,
      state,
      neighborhood,
      address,
      cep,
      minimumSpend: minimumSpendNumber,
    });
    router.push("/admin/bars");
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">Cadastrar bar</div>
        <div className="mt-1 text-sm text-cr-brown-600">Cadastro mock (sem API)</div>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">Nome fantasia</label>
            <Input value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">Razão social</label>
            <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">CNPJ</label>
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required placeholder="00.000.000/0000-00" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-cr-brown-600">Cidade</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-cr-brown-600">UF</label>
              <Input value={state} onChange={(e) => setState(e.target.value)} required maxLength={2} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">Bairro</label>
            <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">Endereço</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Rua, número" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">CEP</label>
            <Input value={cep} onChange={(e) => setCep(e.target.value)} required placeholder="00000-000" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">Consumo mínimo</label>
            <Input
              value={minimumSpend}
              onChange={(e) => setMinimumSpend(e.target.value)}
              required
              inputMode="decimal"
              placeholder="Ex.: 50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
