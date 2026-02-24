"use client";

import * as React from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { BottomNav } from "@/components/app/BottomNav";

type Props = {
  children: React.ReactNode;
};

export function UserLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-cr-cream-50">
      <AppHeader />
      <main className="px-4 py-4 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}
