import { catalog } from './catalog'
import { canAfford, itemCost, ownedCount } from './economy'
import { advance, buy, gain, resetGame, saveGame, setRenderer, startSession, state } from './state'
import './style.css'

const readout = document.getElementById('resource-value')!
const gainButton = document.getElementById('gain-button')!
const shop = document.getElementById('shop')!
const saveButton = document.getElementById('save-button')!
const resetButton = document.getElementById('reset-button')!

/** Timer cadence: roughly ten fires per second (a tunable constant, not spec behavior). */
const TICK_MS = 100

/** Automatic save cadence (a tunable constant, not spec behavior). */
const SAVE_INTERVAL_MS = 20_000

/** Purchase controls built once from the static catalog; labels and affordability update on every render. */
const shopControls = catalog.map((item) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'shop-item'
  button.dataset.itemId = item.id
  button.addEventListener('click', () => buy(item.id))
  shop.appendChild(button)
  return { item, button }
})

function render(): void {
  readout.textContent = String(Math.floor(state.resource))
  for (const { item, button } of shopControls) {
    const owned = ownedCount(state.owned, item.id)
    const cost = itemCost(item, owned)
    button.textContent = `${item.name} (cost ${cost}, owned ${owned})`
    button.disabled = !canAfford(state.resource, cost)
  }
}

setRenderer(render)

gainButton.addEventListener('click', () => gain())

// Session start: restores a valid save (with capped offline progress) or begins a new game.
// This is also the first render.
startSession()

// Automatic saving: a regular interval, plus the moment the page is hidden or closed.
setInterval(() => saveGame(), SAVE_INTERVAL_MS)
window.addEventListener('pagehide', () => saveGame())
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveGame()
})

// Manual save with a brief on-button acknowledgment.
saveButton.addEventListener('click', () => {
  if (saveGame()) {
    saveButton.textContent = 'Saved!'
    setTimeout(() => {
      saveButton.textContent = 'Save'
    }, 1000)
  }
})

// Hard reset behind a confirmation dialog.
resetButton.addEventListener('click', () => {
  if (window.confirm('Erase your save and start a new game?')) resetGame()
})

// Delta-time accumulation: each fire adds real elapsed wall-clock time multiplied
// by the derived per-second rate, so throttled or background tabs stay accurate.
let lastTickAt = performance.now()
setInterval(() => {
  const now = performance.now()
  const elapsedSeconds = (now - lastTickAt) / 1000
  lastTickAt = now
  advance(elapsedSeconds)
}, TICK_MS)
