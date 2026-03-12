/* ─────────────────────────────────────────────────
   Route Store – estado central das rotas
   Usa mock data, preparado para trocar por Supabase
   ───────────────────────────────────────────────── */

import type {
  Route,
  RouteBarEntry,
  RouteParticipation,
  RouteBarVisit,
  RouteBarChallengeCompletion,
  RouteInput,
} from "@/lib/types";
import {
  adminRoutes as mockAdminRoutes,
  bars as mockBars,
} from "@/lib/mockData";

/* ── helpers ── */
function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function calcDeadline(startDate: string, durationDays: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + durationDays);
  return d.toISOString().split("T")[0];
}

/* ── Seed mock data ── */

function seedRoutes(): Route[] {
  return mockAdminRoutes.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    emoji: "🍺",
    difficulty: r.difficulty,
    durationDays: r.durationDays,
    startDate: r.startDate,
    deadline: calcDeadline(r.startDate, r.durationDays),
    prize: r.prize,
    prizeEmoji: "🏆",
    bonusPoints: r.bonusPoints,
    active: r.active,
    participantsCount: r.participantsCount,
    completedCount: r.completedCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Sample challenges for seeded routes
const SAMPLE_CHALLENGES: Record<string, { title: string; description: string; emoji: string; points: number }> = {
  "rb_ar_1_0": { title: "Caça ao Mascote", description: "Encontre o cachorro de cerâmica escondido no bar e tire uma foto", emoji: "🐕", points: 30 },
  "rb_ar_1_2": { title: "Selfie no Balcão", description: "Tire uma selfie com o bartender e poste no Instagram", emoji: "🤳", points: 25 },
  "rb_ar_2_1": { title: "Adivinhe a Cerveja", description: "Peça uma cerveja às cegas e tente adivinhar a marca", emoji: "🍺", points: 20 },
};

function seedRouteBars(): RouteBarEntry[] {
  const entries: RouteBarEntry[] = [];
  for (const r of mockAdminRoutes) {
    r.barIds.forEach((barId, idx) => {
      const rbId = `rb_${r.id}_${idx}`;
      const challenge = SAMPLE_CHALLENGES[rbId] ?? null;
      entries.push({
        id: rbId,
        routeId: r.id,
        barId,
        position: idx,
        points: 50,
        minimumSpend: 25, // R$25 default
        challengeTitle: challenge?.title ?? null,
        challengeDescription: challenge?.description ?? null,
        challengeEmoji: challenge?.emoji ?? null,
        challengePoints: challenge?.points ?? 0,
      });
    });
  }
  return entries;
}

function seedParticipations(): RouteParticipation[] {
  return [
    {
      id: "rp_1",
      routeId: "ar_1",
      userId: "app_usr_1",
      status: "active",
      startedAt: "2026-02-17T10:00:00Z",
      completedAt: null,
    },
    {
      id: "rp_2",
      routeId: "ar_4",
      userId: "app_usr_1",
      status: "completed",
      startedAt: "2026-02-10T10:00:00Z",
      completedAt: "2026-02-16T18:00:00Z",
    },
  ];
}

function seedBarVisits(): RouteBarVisit[] {
  return [
    { id: "rbv_1", routeParticipationId: "rp_1", routeBarId: "rb_ar_1_0", visitedAt: "2026-02-18T20:00:00Z", receiptAmount: 45.00 },
    { id: "rbv_2", routeParticipationId: "rp_1", routeBarId: "rb_ar_1_1", visitedAt: "2026-02-19T21:00:00Z", receiptAmount: 32.50 },
    { id: "rbv_3", routeParticipationId: "rp_2", routeBarId: "rb_ar_4_0", visitedAt: "2026-02-12T19:00:00Z", receiptAmount: 55.00 },
    { id: "rbv_4", routeParticipationId: "rp_2", routeBarId: "rb_ar_4_1", visitedAt: "2026-02-13T20:00:00Z", receiptAmount: 38.00 },
    { id: "rbv_5", routeParticipationId: "rp_2", routeBarId: "rb_ar_4_2", visitedAt: "2026-02-16T18:00:00Z", receiptAmount: 60.00 },
  ];
}

function seedChallengeCompletions(): RouteBarChallengeCompletion[] {
  return [
    { id: "rcc_1", routeParticipationId: "rp_1", routeBarId: "rb_ar_1_0", completedAt: "2026-02-18T20:30:00Z", proofUrl: null },
  ];
}

/* ── Store type ── */

export type RouteStore = {
  routes: Route[];
  routeBars: RouteBarEntry[];
  participations: RouteParticipation[];
  barVisits: RouteBarVisit[];
  challengeCompletions: RouteBarChallengeCompletion[];
};

/* ── Initial state ── */
export function createInitialStore(): RouteStore {
  return {
    routes: seedRoutes(),
    routeBars: seedRouteBars(),
    participations: seedParticipations(),
    barVisits: seedBarVisits(),
    challengeCompletions: seedChallengeCompletions(),
  };
}

/* ── Mutations (return new store, immutable) ── */

export function addRoute(
  store: RouteStore,
  input: RouteInput
): { store: RouteStore; routeId: string } {
  const routeId = `route_${uid()}`;
  const now = new Date().toISOString();

  const route: Route = {
    id: routeId,
    name: input.name,
    description: input.description,
    emoji: input.emoji || "🍺",
    difficulty: input.difficulty,
    durationDays: input.durationDays,
    startDate: input.startDate,
    deadline: calcDeadline(input.startDate, input.durationDays),
    prize: input.prize,
    prizeEmoji: input.prizeEmoji || "🏆",
    bonusPoints: input.bonusPoints,
    active: input.active,
    participantsCount: 0,
    completedCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const newBars: RouteBarEntry[] = input.barIds.map((barId, idx) => {
    const challenge = input.barChallenges?.[barId] ?? null;
    return {
      id: `rb_${routeId}_${idx}`,
      routeId,
      barId,
      position: idx,
      points: input.barPoints[barId] ?? 50,
      minimumSpend: input.barMinimumSpend?.[barId] ?? 0,
      challengeTitle: challenge?.title ?? null,
      challengeDescription: challenge?.description ?? null,
      challengeEmoji: challenge?.emoji ?? null,
      challengePoints: challenge?.points ?? 0,
    };
  });

  return {
    store: {
      ...store,
      routes: [route, ...store.routes],
      routeBars: [...store.routeBars, ...newBars],
    },
    routeId,
  };
}

export function updateRoute(
  store: RouteStore,
  routeId: string,
  input: RouteInput
): RouteStore {
  const now = new Date().toISOString();

  const routes = store.routes.map((r) =>
    r.id === routeId
      ? {
          ...r,
          name: input.name,
          description: input.description,
          emoji: input.emoji || r.emoji,
          difficulty: input.difficulty,
          durationDays: input.durationDays,
          startDate: input.startDate,
          deadline: calcDeadline(input.startDate, input.durationDays),
          prize: input.prize,
          prizeEmoji: input.prizeEmoji || r.prizeEmoji,
          bonusPoints: input.bonusPoints,
          active: input.active,
          updatedAt: now,
        }
      : r
  );

  const otherBars = store.routeBars.filter((rb) => rb.routeId !== routeId);
  const newBars: RouteBarEntry[] = input.barIds.map((barId, idx) => {
    const challenge = input.barChallenges?.[barId] ?? null;
    return {
      id: `rb_${routeId}_${idx}`,
      routeId,
      barId,
      position: idx,
      points: input.barPoints[barId] ?? 50,
      minimumSpend: input.barMinimumSpend?.[barId] ?? 0,
      challengeTitle: challenge?.title ?? null,
      challengeDescription: challenge?.description ?? null,
      challengeEmoji: challenge?.emoji ?? null,
      challengePoints: challenge?.points ?? 0,
    };
  });

  return {
    ...store,
    routes,
    routeBars: [...otherBars, ...newBars],
  };
}

export function removeRoute(store: RouteStore, routeId: string): RouteStore {
  return {
    ...store,
    routes: store.routes.filter((r) => r.id !== routeId),
    routeBars: store.routeBars.filter((rb) => rb.routeId !== routeId),
    participations: store.participations.filter((p) => p.routeId !== routeId),
  };
}

export function joinRoute(
  store: RouteStore,
  userId: string,
  routeId: string
): RouteStore {
  const existing = store.participations.find(
    (p) => p.routeId === routeId && p.userId === userId
  );
  if (existing) return store;

  const participation: RouteParticipation = {
    id: `rp_${uid()}`,
    routeId,
    userId,
    status: "active",
    startedAt: new Date().toISOString(),
    completedAt: null,
  };

  const routes = store.routes.map((r) =>
    r.id === routeId
      ? { ...r, participantsCount: r.participantsCount + 1 }
      : r
  );

  return {
    ...store,
    routes,
    participations: [...store.participations, participation],
  };
}

export function recordBarVisit(
  store: RouteStore,
  participationId: string,
  routeBarId: string,
  receiptAmount?: number
): RouteStore {
  const existing = store.barVisits.find(
    (v) =>
      v.routeParticipationId === participationId &&
      v.routeBarId === routeBarId
  );
  if (existing) return store;

  const visit: RouteBarVisit = {
    id: `rbv_${uid()}`,
    routeParticipationId: participationId,
    routeBarId,
    visitedAt: new Date().toISOString(),
    receiptAmount: receiptAmount ?? null,
  };

  return {
    ...store,
    barVisits: [...store.barVisits, visit],
  };
}

export function completeChallengeForBar(
  store: RouteStore,
  participationId: string,
  routeBarId: string,
  proofUrl?: string
): RouteStore {
  const existing = store.challengeCompletions.find(
    (c) =>
      c.routeParticipationId === participationId &&
      c.routeBarId === routeBarId
  );
  if (existing) return store;

  const completion: RouteBarChallengeCompletion = {
    id: `rcc_${uid()}`,
    routeParticipationId: participationId,
    routeBarId,
    completedAt: new Date().toISOString(),
    proofUrl: proofUrl ?? null,
  };

  return {
    ...store,
    challengeCompletions: [...store.challengeCompletions, completion],
  };
}

export function completeRoute(
  store: RouteStore,
  participationId: string
): RouteStore {
  const participation = store.participations.find(
    (p) => p.id === participationId
  );
  if (!participation || participation.status === "completed") return store;

  const now = new Date().toISOString();

  const participations = store.participations.map((p) =>
    p.id === participationId
      ? { ...p, status: "completed" as const, completedAt: now }
      : p
  );

  const routes = store.routes.map((r) =>
    r.id === participation.routeId
      ? { ...r, completedCount: r.completedCount + 1 }
      : r
  );

  return {
    ...store,
    participations,
    routes,
  };
}

/* ── Queries ── */

export function getRouteBars(
  store: RouteStore,
  routeId: string
): RouteBarEntry[] {
  return store.routeBars
    .filter((rb) => rb.routeId === routeId)
    .sort((a, b) => a.position - b.position);
}

export function getUserParticipation(
  store: RouteStore,
  userId: string,
  routeId: string
): RouteParticipation | null {
  return (
    store.participations.find(
      (p) => p.routeId === routeId && p.userId === userId
    ) ?? null
  );
}

export function getVisitsForParticipation(
  store: RouteStore,
  participationId: string
): RouteBarVisit[] {
  return store.barVisits.filter(
    (v) => v.routeParticipationId === participationId
  );
}

export function getChallengeCompletionsForParticipation(
  store: RouteStore,
  participationId: string
): RouteBarChallengeCompletion[] {
  return store.challengeCompletions.filter(
    (c) => c.routeParticipationId === participationId
  );
}

export function getBarName(barId: string): string {
  return mockBars.find((b) => b.id === barId)?.name ?? barId;
}

export function getBarInfo(barId: string) {
  return mockBars.find((b) => b.id === barId) ?? null;
}

/** Check if all bars in a route have been visited by a participation */
export function isRouteComplete(
  store: RouteStore,
  participationId: string,
  routeId: string
): boolean {
  const routeBarIds = getRouteBars(store, routeId).map((rb) => rb.id);
  const visitedBarIds = new Set(
    getVisitsForParticipation(store, participationId).map(
      (v) => v.routeBarId
    )
  );
  return routeBarIds.every((id) => visitedBarIds.has(id));
}
