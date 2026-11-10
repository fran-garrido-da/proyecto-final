# Tasks

## 1. Cosmic vocabulary

- [x] 1.1 Apply the naming slate (title "Stardust", readout label "Stardust", gain control "Collect", catalog names "Collector Drone" and "Magnetic Gloves"); verify every renamed string renders in the running app and that catalog ids are unchanged
- [x] 1.2 Verify save compatibility: a save written before the theme still restores resource and owned counts (ids stable, persistence spec untouched)

## 2. Visual mood

- [x] 2.1 Add the night-sky palette and CSS starfield background; verify the background renders in the running app (computed styles) with no new dependencies added
- [x] 2.2 Add the affordable-glow affordance on shop buttons; verify affordable and unaffordable states remain clearly distinct and the glow tracks live affordability from clicks and passive growth

## 3. Integration verification

- [x] 3.1 Run the full unit suite, tsc, and production build; verify all tests pass unchanged (no behavior delta) and the build is clean
- [x] 3.2 Walk the core-loop and persistence scenarios plus the theme strings in the dev server and the built app (update the throwaway walk harnesses' label expectations); verify all pass

## Workflow follow-up

- Implement via `/opsx-apply`, after add-save-load is complete and archived.
- Archive this change after all tasks are complete.
