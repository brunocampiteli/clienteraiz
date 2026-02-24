"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function IconBeer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h8l1 2H5l1-2ZM5 5h10v13a3 3 0 01-3 3H8a3 3 0 01-3-3V5ZM15 8h2a2 2 0 012 2v3a2 2 0 01-2 2h-2" />
    </svg>
  );
}

function IconMap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
    </svg>
  );
}

function IconTrophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.144-1.708.503-2.104.906C2.696 5.594 2.25 6.328 2.25 7.5c0 1.336.702 2.39 1.696 3.119.993.726 2.273 1.184 3.6 1.381m0 0a7.454 7.454 0 00.981-3.172M5.25 4.236V3h13.5v1.236m0 0c.996.144 1.708.503 2.104.906.45.452.896 1.186.896 2.358 0 1.336-.702 2.39-1.696 3.119-.993.726-2.273 1.184-3.6 1.381m0 0a7.454 7.454 0 01-.982-3.172" />
    </svg>
  );
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

type Item = {
  label: string;
  href: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  isCenter?: boolean;
};

const items: Item[] = [
  { label: "Início", href: "/app", icon: IconHome },
  { label: "Bares", href: "/app/bars", icon: IconBeer },
  { label: "Rotas", href: "/app/routes", icon: IconMap, isCenter: true },
  { label: "Ranking", href: "/app/ranking", icon: IconTrophy },
  { label: "Perfil", href: "/app/profile", icon: IconUser },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-cr-brown-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-2 py-1.5">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          const Icon = it.icon;

          /* Center CTA button (Rotas) */
          if (it.isCenter) {
            return (
              <Link
                key={it.href}
                href={it.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div
                  className={[
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200",
                    active
                      ? "bg-gradient-to-br from-cr-gold-500 to-cr-gold-700 ring-4 ring-cr-gold-200 scale-105"
                      : "bg-gradient-to-br from-cr-gold-500 to-cr-gold-600 ring-4 ring-cr-cream-100 hover:scale-105",
                  ].join(" ")}
                >
                  <Icon className="h-6 w-6 text-white stroke-[2]" />
                </div>
                <span
                  className={[
                    "mt-0.5 text-[10px] font-bold transition-all",
                    active ? "text-cr-gold-700" : "text-cr-brown-500",
                  ].join(" ")}
                >
                  {it.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1.5 transition-all duration-200",
                active ? "text-cr-green-800" : "text-cr-brown-400 hover:text-cr-green-700",
              ].join(" ")}
            >
              <div className="relative">
                <Icon className={["h-5 w-5 transition-all", active ? "stroke-[2]" : ""].join(" ")} />
                {active && (
                  <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cr-gold-500" />
                )}
              </div>
              <span className={["text-[10px] transition-all", active ? "font-bold" : "font-medium"].join(" ")}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
