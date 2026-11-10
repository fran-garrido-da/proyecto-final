# Proposal

## Why

Once purchases land, a session holds real progress — resource and owned items — that a page reload currently erases. The genre's promise is growth over hours, and losing it on refresh betrays that. This change persists state, restores it safely, grants capped offline progress, and adds manual save and hard reset (both handy for demos).

## What Changes

- Saves game state — resource, owned counts, save format version, and save timestamp — to browser localStorage.
- Saves automatically at a regular interval and when the page is hidden or closed, plus a manual save control.
- On session start, restores a valid save; starts a new game when no save exists; rejects unparseable or invalid saves (non-finite or negative numbers, non-integer or unknown-item counts, unknown version) in favor of a new game.
- Grants offline progress on restore: elapsed time since the save multiplied by the derived per-second rate, capped at a maximum (default 8 hours).
- Adds a hard-reset control that clears the save and starts a new game.
- Clarifies the core-loop initial-state requirements to distinguish a new game from a session restored from a save.
- Out of scope: export/import, cloud sync, and migrations between save versions (format version 1 only; unknown versions start fresh).

## Capabilities

### New Capabilities

- `persistence`: Saving, restoring, and protecting game progress across sessions, including offline progress and reset.

### Modified Capabilities

- `core-loop`: the initial-resource-state and initial-production-rate requirements are clarified to distinguish a new game from a session restored from a save. The capability is introduced by add-click-to-grow-skeleton and extended by add-passive-tick and add-purchases; those changes must be implemented and archived before this one.

## Impact

- New save/load module: serialize, validate, restore, and offline-grant pure functions; startup wiring that begins from a save when one exists.
- UI: manual save and hard-reset controls.
- Storage access wrapped for graceful failure (private-mode or blocked storage).
- Extends the unit test suite with validation and offline-math tests.
