"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

type Props = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-cr-brown-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[17rem] lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-40 bg-cr-brown-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[17rem] shadow-2xl shadow-black/20">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Main content */}
      <div className="lg:pl-[17rem]">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
