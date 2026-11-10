export interface CatalogItem {
  id: string
  name: string
  kind: 'generator' | 'click'
  baseCost: number
  growth: number
  /** For generators: production added per second. For click upgrades: gain added per click. */
  effect: number
}

/** Static purchasable content (tunable data, not spec behavior). Owned counts live in game state; costs are derived from this. */
export const catalog: readonly CatalogItem[] = [
  { id: 'auto-clicker', name: 'Collector Drone', kind: 'generator', baseCost: 15, growth: 1.15, effect: 0.5 },
  { id: 'stronger-fingers', name: 'Magnetic Gloves', kind: 'click', baseCost: 100, growth: 1.15, effect: 1 },
]
