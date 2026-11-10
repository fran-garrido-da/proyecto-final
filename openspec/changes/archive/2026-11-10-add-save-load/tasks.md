# Tasks

## 1. Save/load math and tests

- [x] 1.1 Implement serialize and deserialize-with-validation as pure functions; verify unit tests cover a valid round-trip plus rejection of: unparseable JSON, non-finite or negative resource, negative or non-integer owned counts, unknown item ids, and unknown versions
- [x] 1.2 Implement the offline-grant pure function (elapsed clamped to >= 0, capped, multiplied by the derived rate); verify unit tests cover short-absence proportional grant, long-absence cap, zero rate, and negative elapsed

## 2. Wiring and controls

- [x] 2.1 Save on interval (default 20 seconds), on pagehide, and from a manual save control; verify through devtools that the stored save updates on all three triggers
- [x] 2.2 Begin sessions from storage on startup: no save starts a new game, a valid save restores state with derived rates; verify an F5 round-trip preserves resource and owned counts
- [x] 2.3 Apply the offline grant on restore before the first render; verify a short known absence grants the proportional amount and that editing savedAt back several hours in devtools grants at most the cap
- [x] 2.4 Add the hard-reset control with confirmation; verify it clears storage and starts a new game immediately
- [x] 2.5 Wrap storage access for graceful failure; verify the game remains playable with saving disabled when storage access throws (simulated via a stub)

## 3. Integration verification

- [x] 3.1 Walk every persistence scenario and the clarified core-loop initial-state scenarios in the dev server; verify all pass
- [x] 3.2 Run the full unit suite, production build, and preview; verify reload-resume and the offline grant work in the built app

## Workflow follow-up

- Implement via `/opsx-apply`, after add-click-to-grow-skeleton, add-passive-tick, and add-purchases are complete and archived.
- Archive this change after all tasks are complete.
