import { describe, expect, it } from 'vitest'
import { canAfford, itemCost, perClickGain, perSecondRate } from './economy'

const probeItem = {
  id: 'probe',
  name: 'Probe',
  kind: 'generator' as const,
  baseCost: 15,
  growth: 1.15,
  effect: 0.5,
}

describe('itemCost', () => {
  it('charges the base cost at zero owned', () => {
    expect(itemCost(probeItem, 0)).toBe(15)
  })

  it('grows geometrically with ownership (base 15, growth 1.15, 10 owned = 61)', () => {
    expect(itemCost(probeItem, 10)).toBe(61)
  })
})

describe('derived rates from owned counts', () => {
  it('sums owned generator production into the per-second rate (3 x 0.5 = 1.5)', () => {
    expect(perSecondRate({ 'auto-clicker': 3 })).toBe(1.5)
  })

  it('bases per-click gain at one plus owned click upgrades (1 + 2 x 1 = 3)', () => {
    expect(perClickGain({ 'stronger-fingers': 2 })).toBe(3)
  })

  it('starts at rate 0 and per-click 1 with nothing owned', () => {
    expect(perSecondRate({})).toBe(0)
    expect(perClickGain({})).toBe(1)
  })
})

describe('canAfford', () => {
  it('treats a resource equal to the cost as affordable', () => {
    expect(canAfford(15, 15)).toBe(true)
  })

  it('treats a resource below the cost as unaffordable', () => {
    expect(canAfford(14.9, 15)).toBe(false)
  })
})
