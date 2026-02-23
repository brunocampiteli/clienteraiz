import * as React from "react";
import { AuthGuardUser } from "@/components/app/AuthGuardUser";
import { UserLayout } from "@/components/app/UserLayout";

export default function AppProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuardUser>
      <UserLayout>{children}</UserLayout>
    </AuthGuardUser>
  );
}
