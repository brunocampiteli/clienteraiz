"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";

/* ── Tipo do perfil (alinhado com tabela profiles) ── */
export type UserProfile = {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  avatarUrl: string | null;
  avatarColor: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  pointsTotal: number;
  pointsThisMonth: number;
  level: string;
  levelProgress: number;
  nextLevel: string | null;
  nextLevelPoints: number;
  barsVisited: number;
  receiptsApproved: number;
  createdAt: string;
};

type UserContextValue = {
  user: UserProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const UserContext = React.createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const ctx = React.useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

/* ── Provider ── */

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchProfile = React.useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        city: data.city,
        state: data.state,
        avatarUrl: data.avatar_url,
        avatarColor: data.avatar_color || "#2D6A4F",
        role: data.role,
        status: data.status,
        pointsTotal: data.points_total,
        pointsThisMonth: data.points_this_month,
        level: data.level,
        levelProgress: data.level_progress,
        nextLevel: data.next_level,
        nextLevelPoints: data.next_level_points,
        barsVisited: data.bars_visited,
        receiptsApproved: data.receipts_approved,
        createdAt: data.created_at,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          fetchProfile();
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = React.useMemo<UserContextValue>(
    () => ({ user, loading, refresh: fetchProfile, signOut }),
    [user, loading, fetchProfile, signOut]
  );

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}
