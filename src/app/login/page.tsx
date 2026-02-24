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
    <div className="relative min-h-screen overflow-hidden bg-cr-green-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Gradient orb */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cr-gold-600 opacity-10 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cr-green-600 opacity-20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="w-full rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cr-green-800 shadow-lg">
              <span className="text-lg font-bold text-cr-gold-400 font-display">CR</span>
            </div>
            <div className="text-xl font-bold text-cr-brown-900 font-display">Cliente Raiz</div>
            <div className="mt-1 text-sm text-cr-brown-600">Acesse a área administrativa</div>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-cr-brown-900">E-mail</label>
              <Input
                type="email"
                placeholder="admin@cliente-raiz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-cr-brown-900">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button className="w-full" type="submit">
              Entrar
            </Button>

            <div className="text-center text-xs text-cr-brown-400">
              Login mock: qualquer e-mail/senha válidos salva um token no localStorage.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
