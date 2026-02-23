"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { Input } from "@/components/ui/Input";

type Props = {
  onOpenMobileMenu: () => void;
};

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconBell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
      />
      <path strokeLinecap="round" d="M10 21a2 2 0 004 0" />
    </svg>
  );
}

export function Header({ onOpenMobileMenu }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu"
          type="button"
        >
          <IconMenu className="h-5 w-5 text-zinc-700" />
        </button>

        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-zinc-900">Cliente Raiz</div>
          <div className="hidden sm:block text-xs text-zinc-500">Admin Dashboard</div>
        </div>

        <div className="flex-1" />

        <div className="hidden md:block w-[360px]">
          <Input placeholder="Buscar..." />
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-100"
          aria-label="Notificações"
          type="button"
        >
          <IconBell className="h-5 w-5 text-zinc-700" />
        </button>

        <div className="relative">
          <button
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-100"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-zinc-900">Admin</div>
              <div className="text-xs text-zinc-500">admin@cliente-raiz.com</div>
            </div>
          </button>

          {menuOpen ? (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-50"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="md:hidden px-4 pb-3 sm:px-6 lg:px-8">
        <Input placeholder="Buscar..." />
      </div>
    </header>
  );
}
