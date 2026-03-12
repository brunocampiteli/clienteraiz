"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  children: React.ReactNode;
};

export function AuthGuardUser({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!session) {
        router.replace("/app/login");
        return;
      }
      setReady(true);
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setReady(false);
        router.replace("/app/login");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-cr-dark-800">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 animate-spin text-cr-yellow-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-semibold text-cr-dark-400">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
