"use client";

import * as React from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { BottomNav } from "@/components/app/BottomNav";
import { PushPermissionBanner } from "@/components/app/PushPermissionBanner";
import { registerServiceWorker, listenForPushMessages } from "@/lib/pushClient";

type Props = {
  children: React.ReactNode;
};

export function UserLayout({ children }: Props) {
  React.useEffect(() => {
    registerServiceWorker();
    listenForPushMessages();
  }, []);

  return (
    <div className="min-h-screen bg-cr-cream-50">
      <AppHeader />
      <PushPermissionBanner />
      <main className="px-4 py-4 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
