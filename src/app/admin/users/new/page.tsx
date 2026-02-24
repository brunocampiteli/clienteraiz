"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !cpf.trim() || !email.trim() || !whatsapp.trim()) {
      return;
    }

    console.log("[new user]", { name, cpf, email, whatsapp });
    router.push("/admin/users");
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-2xl font-bold tracking-tight text-cr-brown-900 font-display">Cadastrar usuário</div>
        <div className="mt-1 text-sm text-cr-brown-600">Cadastro mock (sem API)</div>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">CPF</label>
            <Input value={cpf} onChange={(e) => setCpf(e.target.value)} required placeholder="000.000.000-00" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">E-mail</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-cr-brown-600">WhatsApp</label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="+55 11 9XXXX-XXXX" />
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
