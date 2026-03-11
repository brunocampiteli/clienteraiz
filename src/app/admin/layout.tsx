import * as React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RouteProvider } from "@/lib/context/RouteContext";

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <RouteProvider>
        <AdminLayout>{children}</AdminLayout>
      </RouteProvider>
    </AuthGuard>
  );
}
