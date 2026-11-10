import { catalog } from './catalog'
import type { CatalogItem } from './catalog'

/** Cost of an item's next purchase: base cost times growth raised to the owned count, rounded to a whole number. */
export function itemCost(item: CatalogItem, owned: number): number {
  return Math.round(item.baseCost * item.growth ** owned)
}

/** Number of an item currently owned, defaulting to zero. */
export function ownedCount(owned: Record<string, number>, itemId: string): number {
  return owned[itemId] ?? 0
}

/** Derived per-click gain: base 1 plus each owned click upgrade's effect. */
export function perClickGain(owned: Record<string, number>): number {
  return catalog.reduce(
    (total, item) => (item.kind === 'click' ? total + item.effect * ownedCount(owned, item.id) : total),
    1,
  )
}

/** Derived per-second rate: each owned generator's production summed. */
export function perSecondRate(owned: Record<string, number>): number {
  return catalog.reduce(
    (total, item) => (item.kind === 'generator' ? total + item.effect * ownedCount(owned, item.id) : total),
    0,
  )
}

/** Affordability: the resource covers the cost; equality counts as affordable. */
export function canAfford(resource: number, cost: number): boolean {
  return resource >= cost
}
