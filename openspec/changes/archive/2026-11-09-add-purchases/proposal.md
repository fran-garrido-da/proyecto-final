# Proposal

## Why

With clicking (add-click-to-grow-skeleton) and passive growth (add-passive-tick) in place, the resource accumulates but nothing uses it: no decisions, no loop. Purchases turn accumulation into strategy — spend the resource to raise the gain rate — and this change introduces the mechanic, its cost math, and the first two items; all future content extends the same catalog.

## What Changes

- Introduces a static catalog of purchasable items (id, name, kind, base cost, cost growth, effect) and per-item owned counts in state.
- The cost of an item's next purchase is geometric: base cost multiplied by growth raised to the owned count, rounded to a whole number.
- Buying is atomic: it requires and deducts the current cost and increments the owned count; attempts with insufficient resource change nothing.
- Ships two items: one generator (adds per-second production) and one click upgrade (adds per-click gain), with placeholder names (theme deferred).
- Per-click and per-second rates become derived values computed from owned counts — the single source of truth — superseding the stored fields from earlier changes.
- Purchase controls show each item's name, current cost, and owned count, with live affordability that updates as the resource changes.
- Out of scope: additional items and tiers, bulk buy, number formatting, save/load, theme.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `core-loop`: adds spending requirements to the capability introduced by add-click-to-grow-skeleton and extended by add-passive-tick; both must be implemented and archived before this one.

## Impact

- State module: owned counts added; stored per-click and per-second fields replaced by derived values.
- UI: purchase controls rendering through the existing render path.
- New modules: catalog data and pure cost/rate math.
- New dev dependency: vitest — the skeleton's design deferred test-runner introduction to the purchase-math change, where regression risk first becomes real.
