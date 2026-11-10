# Proposal

## Why

The planned skeleton (add-click-to-grow-skeleton) grows the resource only when the player clicks. The genre's core promise — a number that keeps growing on its own, which purchases will later accelerate — requires time-driven production. This change adds that production channel as a small delta on the skeleton's state-and-render pipeline.

## What Changes

- Adds a per-second production rate to game state, starting at 0, so all skeleton behavior is unchanged until something modifies the rate.
- Advances the resource over real elapsed time while a session is open, using wall-clock deltas so throttled or background tabs stay accurate.
- The resource display keeps showing the current value without player interaction, and passive growth accumulates with manual clicking.
- Out of scope: anything that raises the rate above 0 (purchases), number formatting, save/load, offline progress.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `core-loop`: adds requirements for time-driven growth alongside manual gain. The capability is introduced by the in-flight add-click-to-grow-skeleton change, which must be implemented and archived before this one.

## Impact

- State module: new per-second rate field (initial 0) flowing through the existing mutation entry point, now also called by a timer.
- Entry module: timer setup (roughly ten fires per second).
- Render path: unattended display updates.
- No new dependencies.
