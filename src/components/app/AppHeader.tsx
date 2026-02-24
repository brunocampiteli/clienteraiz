"use client";

import * as React from "react";
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
  if (pathname === "/app") return "Início";
  if (pathname.startsWith("/app/bars/")) return "Bar";
  if (pathname === "/app/bars") return "Bares";
  if (pathname === "/app/points") return "Pontos";
  if (pathname === "/app/ranking") return "Ranking";
  if (pathname === "/app/profile") return "Perfil";
  if (pathname === "/app/routes") return "Rotas prontas";
  if (pathname === "/app/treasure") return "Caça ao tesouro";
  return "Cliente Raiz";
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
    <header className="sticky top-0 z-30 border-b border-cr-brown-100 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-base font-bold text-cr-brown-900 font-display">{title}</div>
        <div className="relative">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-cr-cream-200"
            aria-label="Notificações"
            type="button"
            onClick={() => setOpen(true)}
          >
            <IconBell className="h-5 w-5 text-cr-brown-600" />
          </button>
          {unread > 0 ? (
            <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cr-gold-600 px-1 text-[11px] font-bold text-white">
              {unread > 99 ? "99+" : unread}
            </div>
          ) : null}
        </div>
      </div>

      <NotificationsPanel open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
