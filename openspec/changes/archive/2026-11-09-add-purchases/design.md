# Design

## Context

Builds on the skeleton (single mutation entry point, render-on-change) and add-passive-tick (per-second rate, delta-time growth). Must be implemented after both. State entering this change: resource, per-click gain, per-second rate. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Purchase mechanics driven by a static catalog so future content is data, not code.
- Owned counts as the single source of truth for rates.
- Affordability UI served by the existing render path — no new render mechanism.
- Unit tests for the cost and rate math (the point the skeleton's design earmarked for introducing a test runner).

**Non-Goals:**
- No items beyond the two shipped here; no tiers, no bulk buy.
- No number formatting (plain whole numbers remain readable at first-purchase scales).
- No save/load; no theme or final naming (placeholder names, like the skeleton's "Resource" label).

## Decisions

- **Catalog is static data in code; owned counts live in state.** Each item: id, name, kind (generator or click upgrade), base cost, cost growth, and effect value. Cost is derived on demand: `round(baseCost x growth^owned)`. Alternative — storing current costs in state — rejected: it duplicates derivable data and would force saves to persist content.
- **Derived rates supersede stored ones.** Per-click gain = 1 + sum of owned click-upgrade gains; per-second rate = sum of owned generator rates. Both are pure functions of owned counts plus the catalog. This deliberately refactors the stored fields introduced by the skeleton and tick changes: a save can never contain rates contradicting the owned items, and adding items later changes nothing about the state shape. Alternative — purchases updating stored rates — rejected as a second source of truth that drifts.
- **Atomic purchases through the single entry point.** The check-deduct-increment sequence runs inside the one mutation entry point, so no intermediate render can observe a half-applied purchase.
- **Affordability in the render pass.** The render path already runs on every resource change — from clicks and from tick growth — so enabled/disabled state and cost labels update with no additional mechanism.
- **First catalog defaults (tunable data, not spec):** generator "Auto Clicker" — base cost 15, growth 1.15, rate 0.5/s; click upgrade "Stronger Fingers" — base cost 100, growth 1.15, +1 per click. The first generator is reachable in roughly 15 seconds of active clicking, seeding the manual-to-idle transition.
- **Costs round to whole numbers** (`Math.round`); affordability compares resource >= cost. Fractional rates still yield fractional resources internally (per the tick design); only costs are integral.

## Risks / Trade-offs

- [Tuning defaults may feel slow or fast] -> All knobs live in catalog data; adjusting them changes no spec or architecture.
- [Refactor from stored to derived rates touches earlier changes' code] -> Their scenarios are re-walked in this change's integration tasks; the observable behavior they specify (new game: per-click 1, rate 0) is preserved by construction.
- [Geometric costs push displayed numbers toward the thousands quickly] -> Accepted for now; number formatting is a deferred cosmetic change riding the same render path.
