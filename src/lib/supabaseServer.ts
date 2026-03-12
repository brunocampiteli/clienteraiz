import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

/** Server-side Supabase client with service_role (bypasses RLS). Lazy-initialized. */
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabaseAdmin) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
        );
      }
      _supabaseAdmin = createClient(url, key);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (_supabaseAdmin as any)[prop as string];
    if (typeof value === "function") {
      return value.bind(_supabaseAdmin);
    }
    return value;
  },
});
