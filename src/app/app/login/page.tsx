"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { setUserToken } from "@/lib/auth";

export default function UserLoginPage() {
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

    setUserToken("mock-user-token");
    router.replace("/app");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cr-dark-800">
      {/* Chalkboard texture overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }} />

      {/* Warm glow orbs */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cr-yellow-600 opacity-[0.07] blur-[150px]" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cr-burgundy-800 opacity-[0.08] blur-[150px]" />

      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="w-full">
          {/* Logo area */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cr-yellow-600 shadow-xl shadow-cr-yellow-600/20">
              <svg viewBox="0 0 40 40" fill="none" className="h-10 w-10">
                <path d="M13 8h14l2 4H11l2-4Z" fill="#212121" />
                <path d="M11 12h18v16a5 5 0 01-5 5h-8a5 5 0 01-5-5V12Z" fill="#212121" />
                <path d="M29 16h3a3 3 0 013 3v4a3 3 0 01-3 3h-3" stroke="#212121" strokeWidth="2" />
                <path d="M17 12v-2c0-1 1.5-3 3-3s3 2 3 3" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="20" cy="10" rx="3" ry="2" fill="#FFF9C4" opacity="0.7" />
              </svg>
            </div>
            <div className="text-4xl font-display text-cr-yellow-600 tracking-wider">CLIENTE RAIZ</div>
            <div className="mt-1 text-sm font-semibold text-cr-dark-400 tracking-widest uppercase">Fidelidade no Balcao</div>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-cr-dark-600 bg-cr-dark-700/80 p-7 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 text-center">
              <div className="text-xl font-display text-cr-cream-100 tracking-wider">ACESSE SUA CONTA</div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-cr-dark-400 uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-cr-dark-400 uppercase tracking-wider">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-cr-burgundy-800/50 bg-cr-burgundy-950/50 px-4 py-3 text-sm font-semibold text-cr-burgundy-400">
                  {error}
                </div>
              ) : null}

              <Button className="w-full !py-3.5 !text-base" type="submit">
                Entrar
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-cr-dark-500">
            Login mock: salva <code className="font-mono text-cr-yellow-600/60">token_user</code> no localStorage.
          </div>
        </div>
      </div>
    </div>
  );
}
