import { catalog } from './catalog'

/** Current save format version; saves with any other version are rejected in favor of a new game. */
export const SAVE_VERSION = 1

/** Offline progress is capped at this many seconds (8 hours; a tunable constant, not spec behavior). */
export const OFFLINE_CAP_SECONDS = 8 * 60 * 60

export interface SavePayload {
  version: number
  savedAt: number
  resource: number
  owned: Record<string, number>
}

/** Builds the save payload for the given state. Derived rates are never saved; they are recomputed on load. */
export function serialize(resource: number, owned: Record<string, number>, savedAt: number): SavePayload {
  return { version: SAVE_VERSION, savedAt, resource, owned: { ...owned } }
}

const knownIds = new Set(catalog.map((item) => item.id))

/**
 * Parses and validates a stored save. Returns the payload, or null when the save is rejected.
 * Rejection is total: any failure means a new game rather than partial repair.
 */
export function deserialize(raw: string): SavePayload | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof parsed !== 'object' || parsed === null) return null
  const candidate = parsed as Record<string, unknown>
  if (candidate.version !== SAVE_VERSION) return null
  if (typeof candidate.savedAt !== 'number' || !Number.isFinite(candidate.savedAt)) return null
  if (typeof candidate.resource !== 'number' || !Number.isFinite(candidate.resource) || candidate.resource < 0) {
    return null
  }
  if (typeof candidate.owned !== 'object' || candidate.owned === null || Array.isArray(candidate.owned)) return null
  const owned: Record<string, number> = {}
  for (const [id, count] of Object.entries(candidate.owned as Record<string, unknown>)) {
    if (!knownIds.has(id)) return null
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) return null
    owned[id] = count
  }
  return { version: SAVE_VERSION, savedAt: candidate.savedAt, resource: candidate.resource, owned }
}

/**
 * Offline progress for an absence: elapsed time since the save (clamped at >= 0 for clock skew,
 * capped at the maximum) multiplied by the rate derived from the save.
 */
export function offlineGrant(elapsedSeconds: number, perSecond: number, capSeconds: number = OFFLINE_CAP_SECONDS): number {
  const bounded = Math.max(0, elapsedSeconds)
  const capped = Math.min(bounded, capSeconds)
  return capped * perSecond
}
