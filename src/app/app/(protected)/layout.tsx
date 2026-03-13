import * as React from "react";
import { AuthGuardUser } from "@/components/app/AuthGuardUser";
import { UserLayout } from "@/components/app/UserLayout";
import { RouteProvider } from "@/lib/context/RouteContext";
import { UserProvider } from "@/lib/context/UserContext";

export default function AppProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuardUser>
      <UserProvider>
        <RouteProvider>
          <UserLayout>{children}</UserLayout>
        </RouteProvider>
      </UserProvider>
    </AuthGuardUser>
  );
}
