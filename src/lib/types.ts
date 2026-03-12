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
  minimumSpend: number; // consumo mínimo em R$ para validar visita
  // Desafio opcional no bar (dentro da rota)
  challengeTitle: string | null;
  challengeDescription: string | null;
  challengeEmoji: string | null;
  challengePoints: number;
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
  receiptAmount: number | null; // valor da nota (para consumo mínimo)
};

/** Conclusão de desafio de bar na rota */
export type RouteBarChallengeCompletion = {
  id: string;
  routeParticipationId: string;
  routeBarId: string;
  completedAt: string;
  proofUrl: string | null; // foto de prova
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
  challengeCompleted: boolean;
};

/** Rota completa com bars e progresso do user */
export type RouteWithProgress = Route & {
  bars: RouteBarWithInfo[];
  participation: RouteParticipation | null;
  visitedCount: number;
  challengesCompleted: number;
  totalChallenges: number;
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
  barMinimumSpend: Record<string, number>; // barId -> consumo mínimo R$
  barChallenges: Record<string, {
    title: string;
    description: string;
    emoji: string;
    points: number;
  } | null>; // barId -> challenge or null
};
