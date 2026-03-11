import * as React from "react";
import { AuthGuardUser } from "@/components/app/AuthGuardUser";
import { UserLayout } from "@/components/app/UserLayout";
import { RouteProvider } from "@/lib/context/RouteContext";

export default function AppProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuardUser>
      <RouteProvider>
        <UserLayout>{children}</UserLayout>
      </RouteProvider>
    </AuthGuardUser>
  );
}
