"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUserToken } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export function AuthGuardUser({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const token = getUserToken();
    if (!token) {
      router.replace("/app/login");
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
