# Proposal

## Why

Every change so far deliberately deferred theme, and it shows: the game reads as a spreadsheet — "Resource", "Gain", "Auto Clicker", "Stronger Fingers". A cosmic vocabulary gives the automation arc meaning (hand-collecting stardust, better gloves, then a drone fleet that outnumbers your hands), makes the genre's exploding numbers feel motivated rather than absurd, and gives the deferred prestige layer its natural vocabulary later. The existing dark palette already reads as space, so the visual cost is near zero.

## What Changes

- Renames every player-facing string to a cosmic vocabulary: document title "Stardust", the readout label, the gain control "Collect", the generator "Collector Drone", the click upgrade "Magnetic Gloves".
- Item ids (`auto-clicker`, `stronger-fingers`) are untouched — names are display-only catalog data, so existing saves remain valid and restorable.
- Adds a night-sky visual mood purely in CSS: a starfield background built from layered radial gradients, a deepened palette, and a subtle glow on affordable shop buttons. No images, no fonts, no new dependencies.
- No behavioral changes of any kind: no mechanics, no save-format, no spec-level deltas.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- None. The specs are theme-agnostic by design (they speak of the "gain control" and the "resource display", never of button labels or item names), so this change intentionally ships no spec delta. It opts out via `skip_specs: true` in `.openspec.yaml`.

## Impact

- `index.html` (title, readout label, gain control text), `src/catalog.ts` (two item `name` fields), `src/style.css` (palette, starfield, affordable glow).
- No changes to `state`, `economy`, `save`, or `storage` modules; no changes to unit tests' behavior.
