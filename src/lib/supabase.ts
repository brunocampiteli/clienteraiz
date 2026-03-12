import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/** Client-side Supabase client (uses anon key). Lazy-initialized to avoid build-time crash. */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || !key) {
        throw new Error(
          "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
        );
      }
      _supabase = createClient(url, key);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (_supabase as any)[prop as string];
    if (typeof value === "function") {
      return value.bind(_supabase);
    }
    return value;
  },
});
