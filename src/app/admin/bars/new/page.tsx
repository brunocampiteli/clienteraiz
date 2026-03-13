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
  const [instagramHandle, setInstagramHandle] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");

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

    const latNum = latitude.trim() ? Number(latitude) : undefined;
    const lngNum = longitude.trim() ? Number(longitude) : undefined;

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
      instagramHandle: instagramHandle.trim() || undefined,
      latitude: latNum,
      longitude: lngNum,
    });
    router.push("/admin/bars");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-cr-brown-900 font-display">Cadastrar Bar</h1>
        <p className="mt-1 text-sm text-cr-brown-500">Preencha os dados para cadastrar um novo bar</p>
      </div>

      <Card>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Nome fantasia</label>
            <Input value={fantasyName} onChange={(e) => setFantasyName(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Razão social</label>
            <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">CNPJ</label>
            <Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} required placeholder="00.000.000/0000-00" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Cidade</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">UF</label>
              <Input value={state} onChange={(e) => setState(e.target.value)} required maxLength={2} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Bairro</label>
            <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Endereço</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Rua, número" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">CEP</label>
            <Input value={cep} onChange={(e) => setCep(e.target.value)} required placeholder="00000-000" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Consumo mínimo (R$)</label>
            <Input
              value={minimumSpend}
              onChange={(e) => setMinimumSpend(e.target.value)}
              required
              inputMode="decimal"
              placeholder="Ex.: 50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Instagram do bar</label>
            <Input
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@nomedobar"
            />
            <p className="mt-1 text-[11px] text-cr-brown-400">Usado para verificar check-ins via stories</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Latitude</label>
              <Input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                inputMode="decimal"
                placeholder="Ex.: -23.5505"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">Longitude</label>
              <Input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                inputMode="decimal"
                placeholder="Ex.: -46.6333"
              />
            </div>
          </div>
          <p className="-mt-3 text-[11px] text-cr-brown-400">Busque as coordenadas no Google Maps (clique com botão direito no local)</p>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="primary">Salvar</Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
