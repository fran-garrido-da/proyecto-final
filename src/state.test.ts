import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { perClickGain, perSecondRate } from './economy'
import { deserialize, serialize } from './save'
import { SAVE_KEY } from './storage'
import { advance, buy, gain, resetGame, saveGame, startSession, state } from './state'

beforeEach(() => {
  state.resource = 0
  state.owned = {}
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Installs an in-memory localStorage stand-in and returns its backing store. */
function stubStorage(initial: Record<string, string> = {}): Map<string, string> {
  const store = new Map(Object.entries(initial))
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  })
  return store
}

describe('gain', () => {
  it('adds the derived per-click gain to the resource', () => {
    gain()
    expect(state.resource).toBe(1)
  })

  it('reflects owned click upgrades in the derived gain', () => {
    state.owned = { 'stronger-fingers': 2 }
    gain()
    expect(state.resource).toBe(3)
  })
})

describe('advance', () => {
  it('adds elapsed seconds times the derived rate', () => {
    state.owned = { 'auto-clicker': 3 }
    advance(2)
    expect(state.resource).toBe(3)
  })
})

describe('buy', () => {
  it('deducts exactly the cost and increments the owned count', () => {
    state.resource = 15
    expect(buy('auto-clicker')).toBe(true)
    expect(state.resource).toBe(0)
    expect(state.owned['auto-clicker']).toBe(1)
  })

  it('changes nothing when the resource is insufficient', () => {
    state.resource = 14
    expect(buy('auto-clicker')).toBe(false)
    expect(state.resource).toBe(14)
    expect(state.owned['auto-clicker']).toBeUndefined()
    expect(perSecondRate(state.owned)).toBe(0)
    expect(perClickGain(state.owned)).toBe(1)
  })

  it('rejects unknown item ids', () => {
    state.resource = 1000
    expect(buy('not-an-item')).toBe(false)
    expect(state.resource).toBe(1000)
  })
})

describe('startSession', () => {
  it('starts a new game when no save exists', () => {
    stubStorage()
    state.resource = 99
    expect(startSession()).toBe('new-game')
    expect(state.resource).toBe(0)
    expect(state.owned).toEqual({})
  })

  it('restores a valid save with derived rates and its offline grant', () => {
    const savedAt = Date.now() - 10_000
    const raw = JSON.stringify(serialize(5, { 'auto-clicker': 2 }, savedAt))
    stubStorage({ [SAVE_KEY]: raw })
    expect(startSession()).toBe('restored')
    expect(state.owned).toEqual({ 'auto-clicker': 2 })
    // Rate derived from the save's owned counts (2 x 0.5 = 1) times ~10 elapsed seconds.
    expect(state.resource).toBeGreaterThanOrEqual(15)
    expect(state.resource).toBeLessThanOrEqual(15.5)
  })

  it('falls back to a new game for an invalid save', () => {
    stubStorage({ [SAVE_KEY]: '{corrupt' })
    expect(startSession()).toBe('new-game')
    expect(state.resource).toBe(0)
    expect(state.owned).toEqual({})
  })

  it('remains playable when storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
    })
    expect(startSession()).toBe('new-game')
    gain()
    expect(state.resource).toBe(1)
  })
})

describe('saveGame', () => {
  it('writes the current state as a valid save', () => {
    const store = stubStorage()
    state.resource = 3.5
    state.owned = { 'stronger-fingers': 1 }
    expect(saveGame()).toBe(true)
    expect(deserialize(store.get(SAVE_KEY)!)).toMatchObject({
      version: 1,
      resource: 3.5,
      owned: { 'stronger-fingers': 1 },
    })
  })

  it('returns false without throwing when storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('blocked')
      },
    })
    expect(saveGame()).toBe(false)
  })
})

describe('resetGame', () => {
  it('clears the save and returns to a fresh game', () => {
    const store = stubStorage({ [SAVE_KEY]: 'anything' })
    state.resource = 10
    state.owned = { 'auto-clicker': 1 }
    resetGame()
    expect(state.resource).toBe(0)
    expect(state.owned).toEqual({})
    expect(store.has(SAVE_KEY)).toBe(false)
  })
})
