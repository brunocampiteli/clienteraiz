"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NotificationsPanel } from "@/components/app/NotificationsPanel";
import { countUnread, readNotifications, subscribeNotifications } from "@/lib/notifications";

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

function getTitle(pathname: string) {
  if (pathname === "/app") return "INICIO";
  if (pathname.startsWith("/app/bars/")) return "BAR";
  if (pathname === "/app/bars") return "BARES";
  if (pathname === "/app/points") return "PONTOS";
  if (pathname === "/app/ranking") return "RANKING";
  if (pathname === "/app/profile") return "PERFIL";
  if (pathname === "/app/routes") return "ROTAS";
  if (pathname === "/app/treasure") return "TESOUROS";
  return "CLIENTE RAIZ";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = React.useMemo(() => getTitle(pathname), [pathname]);
  const [open, setOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);

  React.useEffect(() => {
    const update = () => setUnread(countUnread(readNotifications()));
    update();
    return subscribeNotifications(update);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-cr-dark-800 border-b border-cr-dark-700">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src="/brand/logo.png" alt="Cliente Raiz" width={32} height={32} className="h-8 w-8 object-contain" />
          <div className="text-lg font-display text-cr-cream-100 tracking-wider">{title}</div>
        </div>
        <div className="relative">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-cr-dark-700 transition-colors"
            aria-label="Notificacoes"
            type="button"
            onClick={() => setOpen(true)}
          >
            <IconBell className="h-5 w-5 text-cr-dark-400" />
          </button>
          {unread > 0 ? (
            <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cr-yellow-600 px-1 text-[11px] font-bold text-cr-dark-800">
              {unread > 99 ? "99+" : unread}
            </div>
          ) : null}
        </div>
      </div>

      <NotificationsPanel open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
