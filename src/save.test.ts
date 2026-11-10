import { describe, expect, it } from 'vitest'
import { SAVE_VERSION, deserialize, offlineGrant, serialize } from './save'

describe('save round-trip', () => {
  it('serializes current state into a versioned payload', () => {
    expect(serialize(12.5, { 'auto-clicker': 2 }, 1000)).toEqual({
      version: SAVE_VERSION,
      savedAt: 1000,
      resource: 12.5,
      owned: { 'auto-clicker': 2 },
    })
  })

  it('restores a valid save (round-trip)', () => {
    const payload = serialize(0, { 'stronger-fingers': 3 }, Date.now())
    expect(deserialize(JSON.stringify(payload))).toEqual(payload)
  })
})

describe('deserialize rejects invalid saves', () => {
  const valid = (overrides: Record<string, unknown>): string =>
    JSON.stringify({ version: SAVE_VERSION, savedAt: 100, resource: 5, owned: { 'auto-clicker': 1 }, ...overrides })

  it('rejects unparseable JSON', () => {
    expect(deserialize('{not json')).toBeNull()
  })

  it('rejects a non-finite resource', () => {
    expect(deserialize('{"version":1,"savedAt":100,"resource":1e999,"owned":{}}')).toBeNull()
  })

  it('rejects a negative resource', () => {
    expect(deserialize(valid({ resource: -1 }))).toBeNull()
  })

  it('rejects a negative owned count', () => {
    expect(deserialize(valid({ owned: { 'auto-clicker': -1 } }))).toBeNull()
  })

  it('rejects a non-integer owned count', () => {
    expect(deserialize(valid({ owned: { 'auto-clicker': 1.5 } }))).toBeNull()
  })

  it('rejects unknown item ids', () => {
    expect(deserialize(valid({ owned: { mystery: 1 } }))).toBeNull()
  })

  it('rejects unknown save versions', () => {
    expect(deserialize(valid({ version: 2 }))).toBeNull()
  })
})

describe('offlineGrant', () => {
  const CAP = 8 * 60 * 60

  it('grants proportionally for a short absence (10s at rate 2 = 20)', () => {
    expect(offlineGrant(10, 2, CAP)).toBe(20)
  })

  it('caps a long absence (24h at rate 2 grants only 8h worth)', () => {
    expect(offlineGrant(24 * 60 * 60, 2, CAP)).toBe(2 * CAP)
  })

  it('grants nothing at zero rate', () => {
    expect(offlineGrant(100, 0, CAP)).toBe(0)
  })

  it('clamps negative elapsed time (clock skew) to zero', () => {
    expect(offlineGrant(-30, 2, CAP)).toBe(0)
  })
})
