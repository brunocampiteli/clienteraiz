"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha.");
      return;
    }

    setToken("mock-token");
    router.replace("/admin");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <div className="text-lg font-semibold text-zinc-900">Cliente Raiz</div>
            <div className="mt-1 text-sm text-zinc-600">Acesse a área administrativa</div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">E-mail</label>
              <Input
                type="email"
                placeholder="admin@cliente-raiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <Button className="w-full" type="submit">
              Entrar
            </Button>

            <div className="text-xs text-zinc-500">
              Login mock: qualquer e-mail/senha válidos (required) salva um token no localStorage.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
