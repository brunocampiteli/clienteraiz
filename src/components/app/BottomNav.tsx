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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-lg grid-cols-5 px-2 py-2">
        {items.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex flex-col items-center justify-center gap-1 rounded-md px-2 py-2 text-xs transition-colors",
                active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800",
              ].join(" ")}
            >
              <span className={["h-1.5 w-1.5 rounded-full", active ? "bg-zinc-900" : "bg-transparent"].join(" ")} />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
