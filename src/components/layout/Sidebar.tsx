"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  onNavigate?: () => void;
};

type Item = {
  label: string;
  href?: string;
  children?: Item[];
};

const items: Item[] = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Bares",
    children: [
      { label: "Lista", href: "/admin/bars" },
      { label: "Cadastrar", href: "/admin/bars/new" },
    ],
  },
  {
    label: "Usuários",
    children: [
      { label: "Lista", href: "/admin/users" },
      { label: "Cadastrar", href: "/admin/users/new" },
    ],
  },
  { label: "Ranking", href: "/admin/ranking" },
  { label: "Notas enviadas", href: "/admin/receipts" },
  { label: "Rotas", href: "/admin/routes" },
  { label: "Desafios", href: "/admin/challenges" },
  { label: "Prêmios", href: "/admin/prizes" },
  { label: "Consumo mínimo", href: "/admin/minimum-spend" },
  { label: "Redes sociais", href: "/admin/social" },
];

function NavLink({ href, label, active, onNavigate }: { href: string; label: string; active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-white/15 text-white shadow-sm"
          : "text-cr-green-200 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-gradient-to-b from-cr-green-900 to-cr-green-950">
      <div className="flex h-16 items-center px-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cr-gold-600 text-sm font-bold text-white shadow-md">
            CR
          </div>
          <div>
            <div className="text-sm font-bold text-white font-display">Cliente Raiz</div>
            <div className="text-[11px] text-cr-green-300">Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="mt-4 space-y-1">
          {items.map((it) => {
            if (it.href) {
              return (
                <NavLink
                  key={it.href}
                  href={it.href}
                  label={it.label}
                  active={pathname === it.href}
                  onNavigate={onNavigate}
                />
              );
            }

            return (
              <div key={it.label} className="pt-4">
                <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-cr-gold-400">
                  {it.label}
                </div>
                <div className="space-y-1">
                  {it.children?.map((c) => (
                    <NavLink
                      key={c.href}
                      href={c.href!}
                      label={c.label}
                      active={pathname === c.href}
                      onNavigate={onNavigate}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4 text-[11px] text-cr-green-400">v0.1</div>
    </aside>
  );
}
