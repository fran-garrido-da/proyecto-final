# Proposal

## Why

The repo is empty: there is no game yet, no toolchain, and no agreed foundation. The game's genre (incremental/idle) is built entirely on top of one pipeline — input changes state, state renders to screen — so the first change should establish both the technical foundation and that pipeline end-to-end. Everything planned afterward (passive production, purchases, saves, theming) is a small delta on this skeleton.

## What Changes

- Scaffold a TypeScript + Vite web app at the repo root (no UI framework; manual DOM rendering is sufficient and keeps the project minimal).
- Introduce the game's central state: a numeric `resource` starting at `0`, and a `perClick` gain value starting at `1`.
- Add the first playable behavior: a gain control and a resource readout. Activating the control increments `resource` by `perClick`, and the readout reflects the new value immediately, with no lost or laggy updates under rapid clicking.
- Out of scope, deferred to later changes: passive per-second production, purchases/upgrades, large-number formatting, save/load, and any theme or content beyond the abstract "resource".

## Capabilities

### New Capabilities

- `core-loop`: The player-facing resource and the ways it grows — beginning with manual gain (clicking) and its immediate on-screen rendering. Future growth mechanics (passive production, spending) extend this capability.

### Modified Capabilities

- None. The project has no existing specs.

## Impact

- Creates new project scaffolding at the repo root: `package.json`, Vite and TypeScript configuration, `index.html`, and a `src/` entry point.
- No existing code or systems are affected (empty repo).
- Dependencies: `vite` and `typescript` as dev dependencies; no runtime dependencies.
