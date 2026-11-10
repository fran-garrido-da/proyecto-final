# Tasks

## 1. Project scaffold

- [x] 1.1 Scaffold the Vite + TypeScript (vanilla-ts) project files at the repo root, coexisting with the existing `openspec/` and `.opencode/` directories; verify `npm run dev` starts and serves a page without errors
- [x] 1.2 Strip the template down to a minimal `index.html` and `src/main.ts`; verify `npm run dev` still runs clean and `npm run build` (TypeScript compile + Vite build) succeeds

## 2. Core loop behavior

- [x] 2.1 Create the state module holding `resource` and `perClick`, mutated only through a single entry-point function that also triggers rendering; verify the project still compiles with no type errors
- [x] 2.2 Add the gain button and the resource readout to the page with minimal legible styling (readout labeled with a neutral placeholder, e.g. "Resource", per the open question in design.md); verify both render on page load and the readout shows 0
- [x] 2.3 Wire the gain button: each activation increments `resource` by `perClick` through the mutation entry point and the readout shows the new value immediately; verify one activation yields 1 and ten rapid activations yield 10 with no lag or lost increments

## 3. Integration verification

- [x] 3.1 Walk every scenario in `specs/core-loop/spec.md` end-to-end in the dev server (fresh session shows 0; single activation; ten rapid activations; keyboard activation works through the native button); verify each scenario passes as written
- [x] 3.2 Run the production build and preview it; verify the click-to-grow behavior holds in the built app, not only in dev mode

## Workflow follow-up

- Implement these tasks via `/opsx-apply` (explore mode does not implement).
- After all tasks are complete, validate the change and archive it (`openspec archive`).
