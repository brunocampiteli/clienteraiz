"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          setError("E-mail ou senha incorretos.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      // Check if user has admin role
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (!profile || profile.role !== "admin") {
          await supabase.auth.signOut();
          setError("Acesso restrito a administradores.");
          setLoading(false);
          return;
        }
      }

      router.replace("/admin");
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cr-dark-800">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }} />

      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cr-yellow-600 opacity-[0.07] blur-[150px]" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cr-burgundy-800 opacity-[0.08] blur-[150px]" />

      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="w-full">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center">
              <Image src="/brand/logo.png" alt="Cliente Raiz" width={128} height={128} className="h-32 w-32 object-contain drop-shadow-lg" priority />
            </div>
            <div className="text-4xl font-display text-cr-yellow-600 tracking-wider">CLIENTE RAIZ</div>
            <div className="mt-1 text-sm font-semibold text-cr-dark-400 tracking-widest uppercase">Area Administrativa</div>
          </div>

          <div className="rounded-2xl border border-cr-dark-600 bg-cr-dark-700/80 p-7 shadow-2xl backdrop-blur-sm">
            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-cr-dark-400 uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  placeholder="admin@cliente-raiz.com"
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

              {error && (
                <div className="rounded-xl border border-cr-burgundy-800/50 bg-cr-burgundy-950/50 px-4 py-3 text-sm font-semibold text-cr-burgundy-400">
                  {error}
                </div>
              )}

              <Button
                className="w-full !py-3.5 !text-base"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
