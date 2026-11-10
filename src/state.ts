import { catalog } from './catalog'
import { canAfford, itemCost, ownedCount, perClickGain, perSecondRate } from './economy'
import { offlineGrant, serialize } from './save'
import { clearSave, loadSave, storeSave } from './storage'

export interface GameState {
  resource: number
  owned: Record<string, number>
}

export const state: GameState = {
  resource: 0,
  owned: {},
}

type Renderer = () => void

let render: Renderer | null = null

/** Registers the render callback invoked after every state mutation. */
export function setRenderer(renderer: Renderer): void {
  render = renderer
}

/** The manual-gain mutation entry point: applies a click gain, then renders. */
export function gain(): void {
  state.resource += perClickGain(state.owned)
  render?.()
}

/** The time-driven mutation entry point: adds production accrued over elapsed seconds, then renders. */
export function advance(deltaSeconds: number): void {
  state.resource += deltaSeconds * perSecondRate(state.owned)
  render?.()
}

/** The purchase mutation entry point: atomically require the cost, deduct it, and increment owned, then render. */
export function buy(itemId: string): boolean {
  const item = catalog.find((entry) => entry.id === itemId)
  if (!item) return false
  const cost = itemCost(item, ownedCount(state.owned, itemId))
  if (!canAfford(state.resource, cost)) return false
  state.resource -= cost
  state.owned[itemId] = ownedCount(state.owned, itemId) + 1
  render?.()
  return true
}

/**
 * Starts the session from storage: restores a valid save (with capped offline progress applied
 * before the first render) or begins a new game. Renders either way; returns which happened.
 */
export function startSession(): 'restored' | 'new-game' {
  const save = loadSave()
  if (!save) {
    state.resource = 0
    state.owned = {}
    render?.()
    return 'new-game'
  }
  const elapsedSeconds = (Date.now() - save.savedAt) / 1000
  state.owned = save.owned
  state.resource = save.resource + offlineGrant(elapsedSeconds, perSecondRate(save.owned))
  render?.()
  return 'restored'
}

/** Saves the current state. Returns whether the write succeeded. */
export function saveGame(): boolean {
  return storeSave(serialize(state.resource, state.owned, Date.now()))
}

/** The reset mutation entry point: clears the save and returns to a fresh game, then renders. */
export function resetGame(): void {
  clearSave()
  state.resource = 0
  state.owned = {}
  render?.()
}
