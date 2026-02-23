import * as React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
