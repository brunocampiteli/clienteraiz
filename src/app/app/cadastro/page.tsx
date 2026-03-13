"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

function maskCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (parseInt(digits[9]) !== check) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return parseInt(digits[10]) === check;
}

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = React.useState("");
  const [sobrenome, setSobrenome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsapp, setWhatsapp] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validations
    if (!nome.trim() || !sobrenome.trim()) {
      setError("Informe nome e sobrenome.");
      return;
    }
    if (!validateCPF(cpf)) {
      setError("CPF inválido.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }
    const phoneDigits = whatsapp.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError("Informe um WhatsApp válido com DDD.");
      return;
    }
    if (senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${nome.trim()} ${sobrenome.trim()}`;
      const cpfClean = cpf.replace(/\D/g, "");
      const phoneClean = whatsapp.replace(/\D/g, "");

      const siteUrl = window.location.origin; // https://clienteraiz.cozirpb.com em prod

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: {
          data: {
            name: fullName,
            cpf: cpfClean,
            phone: phoneClean,
          },
          emailRedirectTo: `${siteUrl}/app/login`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Este e-mail já está cadastrado. Faça login.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      // Update profile with additional fields (the trigger creates basic profile)
      if (data.user) {
        await supabase
          .from("profiles")
          .update({
            name: fullName,
            cpf: cpfClean,
            phone: phoneClean,
          })
          .eq("id", data.user.id);
      }

      setSuccess(true);
    } catch {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-cr-dark-800">
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }} />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cr-green-600 opacity-[0.1] blur-[150px]" />

        <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <div className="w-full text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cr-green-600 shadow-xl shadow-cr-green-600/20">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="h-10 w-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="text-3xl font-display text-cr-green-500 tracking-wider mb-3">CONTA CRIADA!</div>
            <p className="text-sm text-cr-dark-400 mb-6 leading-relaxed">
              Seu cadastro foi realizado com sucesso.<br />
              Verifique seu e-mail para confirmar a conta.
            </p>
            <Link href="/app/login">
              <Button className="!py-3.5 !px-8 !text-base">
                Ir para Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-cr-dark-800">
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
      }} />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-cr-yellow-600 opacity-[0.07] blur-[150px]" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cr-burgundy-800 opacity-[0.08] blur-[150px]" />

      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-10">
        <div className="w-full">
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center">
              <Image src="/brand/logo.png" alt="Cliente Raiz" width={72} height={72} className="h-18 w-18 object-contain drop-shadow-lg" priority />
            </div>
            <div className="text-3xl font-display text-cr-yellow-600 tracking-wider">CLIENTE RAIZ</div>
            <div className="mt-1 text-xs font-semibold text-cr-dark-400 tracking-widest uppercase">Crie sua conta</div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-cr-dark-600 bg-cr-dark-700/80 p-6 shadow-2xl backdrop-blur-sm">
            <form className="space-y-4" onSubmit={onSubmit}>
              {/* Nome / Sobrenome */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">Nome</label>
                  <input
                    type="text"
                    placeholder="João"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">Sobrenome</label>
                  <input
                    type="text"
                    placeholder="Silva"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">CPF</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(maskCPF(e.target.value))}
                  required
                  className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">WhatsApp</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="(11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                  required
                  className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">Senha</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-cr-dark-400 uppercase tracking-wider">Confirmar Senha</label>
                <input
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  minLength={6}
                  className="h-11 w-full rounded-xl border border-cr-dark-600 bg-cr-dark-800 px-4 text-sm font-medium text-cr-cream-100 outline-none transition-all placeholder:text-cr-dark-500 focus:ring-2 focus:ring-cr-yellow-600/40 focus:border-cr-yellow-600"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-cr-burgundy-800/50 bg-cr-burgundy-950/50 px-4 py-3 text-sm font-semibold text-cr-burgundy-400">
                  {error}
                </div>
              )}

              <Button
                className="w-full !py-3 !text-base"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <span className="text-xs text-cr-dark-400">Já tem conta? </span>
              <Link href="/app/login" className="text-xs font-bold text-cr-yellow-600 hover:text-cr-yellow-500 transition-colors">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
