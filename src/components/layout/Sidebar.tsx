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
        "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
        active ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-zinc-200 bg-white">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white">
            CR
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">Cliente Raiz</div>
            <div className="text-xs text-zinc-500">Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="mt-2 space-y-1">
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
              <div key={it.label} className="pt-2">
                <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
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

      <div className="border-t border-zinc-200 p-3 text-xs text-zinc-500">v0.1</div>
    </aside>
  );
}
