"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  label: string;
  href: string;
};

const items: Item[] = [
  { label: "Início", href: "/app" },
  { label: "Bares", href: "/app/bars" },
  { label: "Pontos", href: "/app/points" },
  { label: "Ranking", href: "/app/ranking" },
  { label: "Perfil", href: "/app/profile" },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-cr-brown-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-2 py-2">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200",
                active ? "text-cr-green-800" : "text-cr-brown-400 hover:text-cr-green-700",
              ].join(" ")}
            >
              <span className={["h-1.5 w-1.5 rounded-full transition-all duration-200", active ? "bg-cr-gold-500 scale-100" : "bg-transparent scale-0"].join(" ")} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
