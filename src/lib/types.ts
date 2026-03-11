/* ─────────────────────────────────────────────────
   Tipos centralizados do sistema de rotas
   Alinhados com supabase/schema.sql
   ───────────────────────────────────────────────── */

export type RouteDifficulty = "fácil" | "médio" | "difícil";
export type RouteParticipationStatus = "active" | "completed" | "abandoned";

/** Rota (tabela routes) */
export type Route = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  difficulty: RouteDifficulty;
  durationDays: number;
  startDate: string; // ISO date
  deadline: string; // ISO date (computed)
  prize: string;
  prizeEmoji: string;
  bonusPoints: number;
  active: boolean;
  participantsCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
};

/** Bar dentro de uma rota (tabela route_bars) */
export type RouteBarEntry = {
  id: string;
  routeId: string;
  barId: string;
  position: number;
  points: number;
};

/** Participação do user na rota (tabela route_participations) */
export type RouteParticipation = {
  id: string;
  routeId: string;
  userId: string;
  status: RouteParticipationStatus;
  startedAt: string;
  completedAt: string | null;
};

/** Visita a bar de rota (tabela route_bar_visits) */
export type RouteBarVisit = {
  id: string;
  routeParticipationId: string;
  routeBarId: string;
  visitedAt: string;
};

/* ─────────────────────────────────────────────────
   Tipos compostos (para UI)
   ───────────────────────────────────────────────── */

/** Bar com info extra para exibição na rota */
export type RouteBarWithInfo = RouteBarEntry & {
  barName: string;
  neighborhood: string;
  city: string;
  visited: boolean;
};

/** Rota completa com bars e progresso do user */
export type RouteWithProgress = Route & {
  bars: RouteBarWithInfo[];
  participation: RouteParticipation | null;
  visitedCount: number;
};

/** Input para criar/atualizar rota (admin) */
export type RouteInput = {
  name: string;
  description: string;
  emoji: string;
  difficulty: RouteDifficulty;
  durationDays: number;
  startDate: string;
  prize: string;
  prizeEmoji: string;
  bonusPoints: number;
  active: boolean;
  barIds: string[]; // ordered bar IDs
  barPoints: Record<string, number>; // barId -> points for this route
};
