# Design

## Context

Empty repository; this is the project's first code. The change establishes the toolchain and the input -> state -> render pipeline that every later feature (passive tick, purchases, save/load) extends. See `proposal.md` for motivation. The genre is UI + timers + state — no graphics — so the entire surface for this change is one button and one numeric readout.

## Goals / Non-Goals

**Goals:**
- A typed, minimal foundation (Vite + TypeScript, no UI framework) that later changes delta onto.
- The full pipeline working end-to-end: activating the gain control mutates state, and the readout renders the new value immediately.
- State shaped so future mechanics plug in as data changes, not refactors.

**Non-Goals:**
- No game loop or tick timer — that is the next change.
- No purchases, save/load, large-number formatting, or theme/styling beyond minimal legibility.
- No automated test harness in this change; the spec scenarios are small and manually verifiable (see Risks).

## Decisions

- **Vite + TypeScript, no UI framework.** The UI is two elements; manual DOM updates are trivial at this scale and keep the dependency surface at zero runtime packages. Alternatives: React/Svelte (declarative rendering is unjustified overhead here, though a reasonable later addition if panels multiply) and plain JavaScript in one file (fastest to start, but the genre is pure math and the type checker catches silent `NaN` poisoning and typo'd properties early).
- **A single state object is the source of truth.** `{ resource: number, perClick: number }`, mutated only through one entry-point function that also triggers rendering. Later mechanics (per-second production, purchases) extend this object instead of adding parallel state, and future save/load can snapshot it wholesale. Alternative: scattered variables — rejected because serialization and debugging both want one shape.
- **Render on change, not on a loop.** Rendering happens inside the mutation entry point, immediately after each state change. A `requestAnimationFrame`/interval render loop is deliberately absent — it arrives with the tick change, where continuous rendering becomes necessary. Prematurely looping now would burn CPU on a static screen and blur the pipeline being established.
- **`perClick` is data, not a hardcoded `+1`.** The increment reads the state's per-click gain (initially 1), so the future first-upgrade change modifies a value instead of refactoring logic.
- **Native `<button>` for the gain control.** Free keyboard activation, focus, and semantics; no custom click handling on non-interactive elements.

## Risks / Trade-offs

- [Manual render calls can be forgotten as state grows] -> Mitigation: all mutation flows through the single entry-point function for now; revisit an event-driven or centralized render trigger when the tick change lands.
- [No automated tests yet] -> Mitigation: the spec scenarios are verifiable by hand in the dev server within minutes; introduce a test runner alongside the purchase-math change, where regression risk first becomes real.
- [Plain JS numbers cap out near 9 quadrillion] -> Not reachable in this change's scope; deferred to the formatting change together with a big-number library decision.

## Migration Plan

Not applicable — first code in an empty repo. Rollback is deleting the scaffold.

## Open Questions

- The resource's display name ("resource"? "points"?): cosmetic, safely deferrable; the future theme change renames it regardless.
