# Tasks

## 1. State and time-driven growth

- [x] 1.1 Add the per-second rate to the state module (initial value 0), flowing through the existing mutation entry point; verify the project compiles and a fresh session still passes every skeleton scenario unchanged
- [x] 1.2 Implement delta-time accumulation (timer firing roughly ten times per second; each fire adds elapsed wall-clock time multiplied by the rate); verify by temporarily setting the rate to 1 that the resource grows by roughly 1 per second over several seconds, then restore 0

## 2. Rendering and combination

- [x] 2.1 Render passive growth through the existing render path, flooring fractional values for display; verify the readout increases unattended over several seconds with no interaction
- [x] 2.2 Verify clicks and passive growth accumulate together (rate 1 plus one click over one second yields +2 total)

## 3. Integration verification

- [x] 3.1 Walk every core-loop scenario (the skeleton's and this change's) in the dev server; verify all pass
- [x] 3.2 Run the production build and preview; verify passive growth works in the built app, including after briefly backgrounding the tab

## Workflow follow-up

- Implement via `/opsx-apply`, after add-click-to-grow-skeleton is complete and archived.
- Archive this change after all tasks are complete.
