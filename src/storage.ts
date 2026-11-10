import type { SavePayload } from './save'
import { deserialize } from './save'

/** The single stable localStorage key holding the save. */
export const SAVE_KEY = 'incremental-game-save'

let warned = false

function warnOnce(message: string, error: unknown): void {
  if (warned) return
  warned = true
  console.warn(message, error)
}

/** Returns localStorage, or null when storage is unavailable (blocked, private mode, non-DOM environment). */
function openStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch (error) {
    warnOnce('Save storage is unavailable; the game will run without saving.', error)
    return null
  }
}

/** Loads and validates the stored save. Returns null when absent, unreadable, or rejected. */
export function loadSave(): SavePayload | null {
  const storage = openStorage()
  if (!storage) return null
  let raw: string | null
  try {
    raw = storage.getItem(SAVE_KEY)
  } catch (error) {
    warnOnce('Reading the save failed; starting a fresh game.', error)
    return null
  }
  if (raw === null) return null
  const payload = deserialize(raw)
  if (!payload) {
    console.warn('Rejected an invalid stored save; starting a fresh game.')
    return null
  }
  return payload
}

/** Persists a save. Returns whether the write succeeded. */
export function storeSave(payload: SavePayload): boolean {
  const storage = openStorage()
  if (!storage) return false
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(payload))
    return true
  } catch (error) {
    warnOnce('Saving failed; progress will not be persisted.', error)
    return false
  }
}

/** Removes the stored save. Returns whether the removal succeeded. */
export function clearSave(): boolean {
  const storage = openStorage()
  if (!storage) return false
  try {
    storage.removeItem(SAVE_KEY)
    return true
  } catch (error) {
    warnOnce('Clearing the save failed.', error)
    return false
  }
}
