# Tasks

## 1. Purchase math and tests

- [x] 1.1 Add vitest as a dev dependency with a test script; verify `npm test` runs and reports a passing placeholder
- [x] 1.2 Implement the catalog type and pure cost/rate math (cost = round(baseCost x growth^owned); per-click and per-second derived from owned counts); verify unit tests cover the cost formula (15 at 0 owned; 61 at 10 owned with growth 1.15), derived rates, and the affordability boundary (resource equal to cost is affordable)

## 2. State and purchase UI

- [x] 2.1 Extend state with owned counts and replace the stored per-click and per-second fields with derived values; verify the project compiles and a fresh game still passes the skeleton and tick scenarios (resource 0, per-click gain 1, rate 0)
- [x] 2.2 Render purchase controls (name, current cost, owned count, disabled when unaffordable) through the existing render path; verify affordability updates live both from clicks and from passive growth
- [x] 2.3 Wire buying through the mutation entry point as an atomic check-deduct-increment; verify a successful buy deducts exactly the cost and an insufficient-resource attempt changes nothing

## 3. First catalog and integration

- [x] 3.1 Add the two catalog items with the default tuning; verify the first Auto Clicker is reachable within about a minute of active clicking and its income becomes visible in the readout
- [x] 3.2 Walk every core-loop scenario (the skeleton's, the tick's, and this change's) in the dev server; verify all pass
- [x] 3.3 Run the full unit suite, production build, and preview; verify tests pass and purchases work in the built app

## Workflow follow-up

- Implement via `/opsx-apply`, after add-click-to-grow-skeleton and add-passive-tick are complete and archived.
- Archive this change after all tasks are complete.
