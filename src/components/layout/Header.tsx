"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5"
      />
      <path strokeLinecap="round" d="M10 21a2 2 0 004 0" />
    </svg>
  );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
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
    <header className="sticky top-0 z-30 border-b border-cr-brown-100/80 bg-white/95 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cr-brown-100 hover:bg-cr-brown-50 transition-colors"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu"
          type="button"
        >
          <IconMenu className="h-5 w-5 text-cr-brown-500" />
        </button>

        {/* Breadcrumb / Title area */}
        <div className="flex items-center gap-2">
          <div className="text-base font-bold text-cr-brown-900 font-display tracking-wide">ADMIN</div>
          <div className="hidden sm:block h-4 w-px bg-cr-brown-200" />
          <div className="hidden sm:block text-xs font-medium text-cr-brown-400">Cliente Raiz</div>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:block w-[340px]">
          <div className="relative">
            <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cr-brown-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="h-10 w-full rounded-xl border border-cr-brown-100 bg-cr-brown-50/50 pl-10 pr-4 text-sm text-cr-brown-800 placeholder:text-cr-brown-300 outline-none transition-all focus:border-cr-gold-400 focus:bg-white focus:ring-2 focus:ring-cr-gold-400/15"
            />
          </div>
        </div>

        {/* Notifications */}
        <button
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cr-brown-100 hover:bg-cr-brown-50 transition-colors"
          aria-label="Notificações"
          type="button"
        >
          <IconBell className="h-[18px] w-[18px] text-cr-brown-500" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cr-gold-600 text-[9px] font-bold text-white shadow-sm">
            3
          </span>
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            className="inline-flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-cr-brown-50 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cr-brown-800 to-cr-brown-900 text-xs font-bold text-cr-gold-400 shadow-sm">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-cr-brown-800">Admin</div>
              <div className="text-[11px] text-cr-brown-400">admin@cliente-raiz.com</div>
            </div>
            <IconChevron className={[
              "hidden sm:block h-4 w-4 text-cr-brown-400 transition-transform duration-200",
              menuOpen ? "rotate-180" : "",
            ].join(" ")} />
          </button>

          {menuOpen ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-cr-brown-100 bg-white p-1.5 shadow-xl shadow-cr-brown-900/5">
                <div className="px-3 py-2 border-b border-cr-brown-50 mb-1">
                  <div className="text-xs font-semibold text-cr-brown-800">Admin</div>
                  <div className="text-[11px] text-cr-brown-400">admin@cliente-raiz.com</div>
                </div>
                <button
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-cr-brown-600 hover:bg-cr-brown-50 hover:text-cr-brown-900 transition-colors"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Sair
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3 sm:px-6">
        <div className="relative">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cr-brown-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-10 w-full rounded-xl border border-cr-brown-100 bg-cr-brown-50/50 pl-10 pr-4 text-sm text-cr-brown-800 placeholder:text-cr-brown-300 outline-none transition-all focus:border-cr-gold-400 focus:bg-white focus:ring-2 focus:ring-cr-gold-400/15"
          />
        </div>
      </div>
    </header>
  );
}
