"use client";

import * as React from "react";
import type {
  Route,
  RouteBarEntry,
  RouteInput,
  RouteWithProgress,
  RouteBarWithInfo,
} from "@/lib/types";
import {
  type RouteStore,
  createInitialStore,
  addRoute as storeAddRoute,
  updateRoute as storeUpdateRoute,
  removeRoute as storeRemoveRoute,
  joinRoute as storeJoinRoute,
  getRouteBars,
  getUserParticipation,
  getVisitsForParticipation,
  getChallengeCompletionsForParticipation,
  getBarInfo,
} from "@/lib/store/routeStore";
import { triggerBarVisit } from "@/lib/services/visitTrigger";

/* ── Context value type ── */

type RouteContextValue = {
  // Admin
  routes: Route[];
  getRouteBarIds: (routeId: string) => string[];
  getRouteBarEntries: (routeId: string) => RouteBarEntry[];
  createRoute: (input: RouteInput) => string;
  editRoute: (routeId: string, input: RouteInput) => void;
  deleteRoute: (routeId: string) => void;

  // User
  getUserRoutes: (userId: string) => RouteWithProgress[];
  getRouteWithProgress: (userId: string, routeId: string) => RouteWithProgress | null;
  participateInRoute: (userId: string, routeId: string) => void;

  // Triggers (called when receipt/checkin approved)
  onBarVisitTriggered: (userId: string, barId: string) => void;
};

const RouteContext = React.createContext<RouteContextValue | null>(null);

export function useRoutes(): RouteContextValue {
  const ctx = React.useContext(RouteContext);
  if (!ctx) throw new Error("useRoutes must be used within RouteProvider");
  return ctx;
}

/* ── Provider ── */

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = React.useState<RouteStore>(() =>
    createInitialStore()
  );

  /* ── Admin actions ── */

  const routes = store.routes;

  const getRouteBarIds = React.useCallback(
    (routeId: string): string[] => {
      return getRouteBars(store, routeId).map((rb) => rb.barId);
    },
    [store]
  );

  const getRouteBarEntries = React.useCallback(
    (routeId: string): RouteBarEntry[] => {
      return getRouteBars(store, routeId);
    },
    [store]
  );

  const createRoute = React.useCallback(
    (input: RouteInput): string => {
      let routeId = "";
      setStore((prev) => {
        const result = storeAddRoute(prev, input);
        routeId = result.routeId;
        return result.store;
      });
      return routeId;
    },
    []
  );

  const editRoute = React.useCallback(
    (routeId: string, input: RouteInput) => {
      setStore((prev) => storeUpdateRoute(prev, routeId, input));
    },
    []
  );

  const deleteRoute = React.useCallback((routeId: string) => {
    setStore((prev) => storeRemoveRoute(prev, routeId));
  }, []);

  /* ── User queries ── */

  const buildRouteWithProgress = React.useCallback(
    (route: Route, userId: string): RouteWithProgress => {
      const bars = getRouteBars(store, route.id);
      const participation = getUserParticipation(store, userId, route.id);
      const visits = participation
        ? getVisitsForParticipation(store, participation.id)
        : [];
      const challengeCompletions = participation
        ? getChallengeCompletionsForParticipation(store, participation.id)
        : [];
      const visitedRouteBarIds = new Set(visits.map((v) => v.routeBarId));
      const completedChallengeBarIds = new Set(challengeCompletions.map((c) => c.routeBarId));

      const barsWithInfo: RouteBarWithInfo[] = bars.map((rb) => {
        const info = getBarInfo(rb.barId);
        return {
          ...rb,
          barName: info?.name ?? rb.barId,
          neighborhood: info?.neighborhood ?? "",
          city: info?.city ?? "",
          visited: visitedRouteBarIds.has(rb.id),
          challengeCompleted: completedChallengeBarIds.has(rb.id),
        };
      });

      const totalChallenges = bars.filter((rb) => rb.challengeTitle).length;
      const challengesCompleted = bars.filter(
        (rb) => rb.challengeTitle && completedChallengeBarIds.has(rb.id)
      ).length;

      return {
        ...route,
        bars: barsWithInfo,
        participation,
        visitedCount: visits.length,
        challengesCompleted,
        totalChallenges,
      };
    },
    [store]
  );

  const getUserRoutes = React.useCallback(
    (userId: string): RouteWithProgress[] => {
      return store.routes.map((route) =>
        buildRouteWithProgress(route, userId)
      );
    },
    [store, buildRouteWithProgress]
  );

  const getRouteWithProgress = React.useCallback(
    (userId: string, routeId: string): RouteWithProgress | null => {
      const route = store.routes.find((r) => r.id === routeId);
      if (!route) return null;
      return buildRouteWithProgress(route, userId);
    },
    [store, buildRouteWithProgress]
  );

  /* ── User actions ── */

  const participateInRoute = React.useCallback(
    (userId: string, routeId: string) => {
      setStore((prev) => storeJoinRoute(prev, userId, routeId));
    },
    []
  );

  /* ── Triggers ── */

  const onBarVisitTriggered = React.useCallback(
    (userId: string, barId: string) => {
      setStore((prev) => triggerBarVisit(prev, userId, barId));
    },
    []
  );

  const value = React.useMemo<RouteContextValue>(
    () => ({
      routes,
      getRouteBarIds,
      getRouteBarEntries,
      createRoute,
      editRoute,
      deleteRoute,
      getUserRoutes,
      getRouteWithProgress,
      participateInRoute,
      onBarVisitTriggered,
    }),
    [
      routes,
      getRouteBarIds,
      getRouteBarEntries,
      createRoute,
      editRoute,
      deleteRoute,
      getUserRoutes,
      getRouteWithProgress,
      participateInRoute,
      onBarVisitTriggered,
    ]
  );

  return (
    <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
  );
}
