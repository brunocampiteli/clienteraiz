// Server-side only — in-memory subscription store (mock)
// Substituir por queries no banco de dados quando tiver backend real

import type { PushSubscription } from "web-push";

const subscriptions: Map<string, PushSubscription> = new Map();

export function addSubscription(sub: PushSubscription): void {
  subscriptions.set(sub.endpoint, sub);
}

export function removeSubscription(endpoint: string): void {
  subscriptions.delete(endpoint);
}

export function getAllSubscriptions(): PushSubscription[] {
  return Array.from(subscriptions.values());
}

export function getSubscriptionCount(): number {
  return subscriptions.size;
}
