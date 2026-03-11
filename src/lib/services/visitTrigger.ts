/* ─────────────────────────────────────────────────
   Visit Trigger – auto-registra visita quando
   nota fiscal ou check-in é aprovado
   ───────────────────────────────────────────────── */

import type { RouteStore } from "@/lib/store/routeStore";
import {
  recordBarVisit,
  completeRoute,
  isRouteComplete,
} from "@/lib/store/routeStore";

/**
 * Quando uma nota fiscal ou check-in é aprovado para um bar,
 * verifica se o user tem rotas ativas contendo esse bar
 * e registra a visita automaticamente.
 *
 * Retorna o store atualizado.
 */
export function triggerBarVisit(
  store: RouteStore,
  userId: string,
  barId: string
): RouteStore {
  let current = store;

  // Find all active participations for this user
  const activeParticipations = current.participations.filter(
    (p) => p.userId === userId && p.status === "active"
  );

  for (const participation of activeParticipations) {
    // Find route bars matching this barId in this route
    const matchingRouteBars = current.routeBars.filter(
      (rb) => rb.routeId === participation.routeId && rb.barId === barId
    );

    for (const routeBar of matchingRouteBars) {
      // Record the visit
      current = recordBarVisit(current, participation.id, routeBar.id);

      // Check if route is now complete
      if (isRouteComplete(current, participation.id, participation.routeId)) {
        current = completeRoute(current, participation.id);
      }
    }
  }

  return current;
}
