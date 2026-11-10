# Design

## Context

Catalog names were made tunable data from day one; every other player-facing string is a one-line edit in `index.html`/`main.ts`; styling is a standalone `style.css`. Builds on all four archived changes and touches no behavior. See proposal.md - Why for motivation.

## Goals / Non-Goals

**Goals:**
- One coherent cosmic vocabulary across every player-facing string, chosen so the automation arc reads through the names alone.
- Visual mood in CSS only, preserving the zero-runtime-dependency constraint.
- Save compatibility: display names change, ids and save format do not.

**Non-Goals:**
- No flavor layer (item descriptions, taglines) — content authoring, deferred.
- No number formatting (deferred; cosmic will favor scientific notation when it happens).
- No new catalog items, mechanics, or prestige.
- No i18n machinery; UI language stays English, `lang="en"` unchanged.

## Decisions

- **Rename `name` fields only, never item ids.** The persistence spec rejects owned counts keyed by unknown ids, so renaming `auto-clicker`/`stronger-fingers` would destroy every existing save. Names are display data; ids are the save contract.
- **Naming slate:** title "Stardust" (over "Star Harvest" — matches the resource name, shorter); gain control "Collect" (one syllable, matches the resource); "Collector Drone" over "Drone Swarm" (reads as a per-unit noun next to owned counts: "owned 3"); "Magnetic Gloves" over "Graviton Grip" (legible over jargon). Functional control words ("Save", "Reset", "Saved!") stay as-is — controls, not fantasy.
- **Starfield via layered fixed radial-gradients on the body.** A handful of `radial-gradient` spots at staggered positions/sizes reads as stars with no image files, no JS, no deps. Alternative (a repeating tiled SVG data-URI) rejected: more moving parts for the same effect.
- **Affordability glow = box-shadow on non-disabled shop buttons.** The existing `opacity: 0.45` disabled cue stays, so the affordable/unaffordable distinction survives both cues; no JS changes.
- **Deepen the existing nord-dark palette toward night sky** (background and accents) rather than replacing it wholesale — the current tokens already read as a space UI.

## Risks / Trade-offs

- [Cosmic theming is familiar genre territory] -> Accepted; distinctness comes from future content vocabulary (Miner, Fusion Refinery, Dyson Swarm), not from this change.
- [Gradient starfields can band or dither on some displays] -> Accepted at this scope; cheap, dependency-free, and easily replaced later.
- [Renamed strings break the throwaway verification harnesses' label assertions] -> Update harness expectations alongside the renames; they are temp files, not project code.
