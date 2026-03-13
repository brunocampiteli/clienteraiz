"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  onNavigate?: () => void;
};

type Item = {
  label: string;
  href?: string;
  icon?: string;
  children?: Item[];
};

const items: Item[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  {
    label: "Bares",
    icon: "beer",
    children: [
      { label: "Lista", href: "/admin/bars" },
      { label: "Cadastrar", href: "/admin/bars/new" },
    ],
  },
  {
    label: "Usuários",
    icon: "users",
    children: [
      { label: "Lista", href: "/admin/users" },
      { label: "Cadastrar", href: "/admin/users/new" },
    ],
  },
  { label: "Ranking", href: "/admin/ranking", icon: "trophy" },
  { label: "Notas enviadas", href: "/admin/receipts", icon: "receipt" },
  { label: "Check-ins", href: "/admin/checkins", icon: "camera" },
  { label: "Rotas & Desafios", href: "/admin/routes", icon: "map" },
  { label: "Prêmios", href: "/admin/prizes", icon: "gift" },
  { label: "Redes sociais", href: "/admin/social", icon: "share" },
  { label: "Notificações push", href: "/admin/notifications", icon: "bell" },
];

function IconSvg({ name, className }: { name: string; className?: string }) {
  const cn = className ?? "h-4 w-4";
  const props = { className: cn, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case "beer": return <svg {...props}><path d="M17 11h1a3 3 0 010 6h-1" /><path d="M5 8h12v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" /><path d="M7 3v5M11 3v5M15 3v5" /></svg>;
    case "users": return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
    case "trophy": return <svg {...props}><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 1012 0V2z" /></svg>;
    case "receipt": return <svg {...props}><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z" /><path d="M8 10h8M8 14h4" /></svg>;
    case "camera": return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>;
    case "map": return <svg {...props}><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" /><path d="M8 2v16M16 6v16" /></svg>;
    case "target": return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
    case "gift": return <svg {...props}><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 110-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" /></svg>;
    case "dollar": return <svg {...props}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
    case "share": return <svg {...props}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" /></svg>;
    case "bell": return <svg {...props}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
    default: return null;
  }
}

function NavLink({ href, label, icon, active, onNavigate }: { href: string; label: string; icon?: string; active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200",
        active
          ? "bg-cr-gold-600/15 text-cr-gold-400 shadow-[inset_0_0_0_1px_rgba(212,164,51,0.2)]"
          : "text-cr-brown-400 hover:bg-white/5 hover:text-cr-brown-200",
      ].join(" ")}
    >
      {icon && (
        <span className={[
          "flex-shrink-0 transition-colors",
          active ? "text-cr-gold-500" : "text-cr-brown-500 group-hover:text-cr-brown-300",
        ].join(" ")}>
          <IconSvg name={icon} />
        </span>
      )}
      {label}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cr-gold-500" />
      )}
    </Link>
  );
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-cr-brown-950 border-r border-cr-brown-900/50">
      {/* Brand */}
      <div className="flex h-[4.5rem] items-center px-5 border-b border-cr-brown-800/40">
        <div className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="Cliente Raiz" width={40} height={40} className="h-10 w-10 object-contain" />
          <div>
            <div className="text-sm font-bold text-cr-brown-50 font-display tracking-wider">CLIENTE RAIZ</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-cr-gold-600">Painel Admin</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="mt-5 space-y-0.5">
          {items.map((it) => {
            if (it.href) {
              return (
                <NavLink
                  key={it.href}
                  href={it.href}
                  label={it.label}
                  icon={it.icon}
                  active={pathname === it.href}
                  onNavigate={onNavigate}
                />
              );
            }

            const isActive = it.children?.some((c) => pathname === c.href);

            return (
              <div key={it.label} className="pt-5">
                <div className="flex items-center gap-2 px-3 pb-2">
                  {it.icon && (
                    <span className={isActive ? "text-cr-gold-600" : "text-cr-brown-600"}>
                      <IconSvg name={it.icon} className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <span className={[
                    "text-[10px] font-bold uppercase tracking-[0.15em]",
                    isActive ? "text-cr-gold-600" : "text-cr-brown-600",
                  ].join(" ")}>
                    {it.label}
                  </span>
                </div>
                <div className="space-y-0.5 pl-1">
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

      {/* Footer */}
      <div className="border-t border-cr-brown-800/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-cr-green-500 animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-cr-brown-600">Sistema ativo</span>
        </div>
        <div className="mt-1 text-[10px] text-cr-brown-700">v0.1.0</div>
      </div>
    </aside>
  );
}
