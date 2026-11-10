# Design

## Context

Builds on add-purchases, after which state is resource plus owned counts, with rates derived from owned counts via the static catalog, and on add-passive-tick's delta-time math. Must be implemented after add-click-to-grow-skeleton, add-passive-tick, and add-purchases. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Reload-resume: a saved session restores exactly what was saved, with rates recomputed (never trusted from storage).
- Never trust persisted input: every loaded value is validated before use.
- Offline progress capped, computed with the same elapsed-times-rate math as the tick.
- Manual save and hard reset for demos.

**Non-Goals:**
- No export/import or cloud sync.
- No migration machinery beyond a version field (format version 1; unknown versions start fresh).
- No changes to gameplay math.

## Decisions

- **localStorage, one stable key.** Synchronous, trivial API, ample for a roughly 200-byte payload. Alternatives rejected: IndexedDB (async complexity for no benefit at this size), a server (infrastructure for zero player value), file export (deferred — a nice demo addition later).
- **Payload: { version, savedAt, resource, owned }.** Only minimal state — derived rates are recomputed on load, so the purchases change's derived-rates decision pays off here: saves cannot contain contradictory rates. `savedAt` (wall-clock timestamp) exists to compute offline elapsed.
- **Save triggers: interval (default 20 seconds) + pagehide + manual button.** `pagehide`/`visibilitychange` are more reliable than `beforeunload`, especially on mobile; the interval covers crashes. The manual button is nearly free and demo-friendly. Alternative — saving on every mutation — rejected as needless write churn.
- **Validation on load, total rejection on failure.** Parse in a try/catch; require: version equals the current format version; resource finite and >= 0; owned counts integer and >= 0 with ids present in the catalog. Any failure means a fresh game plus a console warning. Whole-save rejection over partial repair: a save failing one rule is untrusted in toto. This is the load-time antidote to the NaN-poisoning risk the skeleton design flagged.
- **Offline grant: min(elapsed, CAP) x derived rate.** Elapsed = now minus savedAt, clamped at >= 0 (clock skew); CAP default 8 hours (tunable constant). Applied once at restore, before the first render. Same math as the tick's delta-time accumulator — deliberate reuse.
- **Storage unavailability handled gracefully.** All reads and writes wrapped; if storage throws (private mode, blocked), the game runs without saving and warns once.

## Risks / Trade-offs

- [Two open tabs overwrite each other's saves (last write wins), and both could grant offline progress] -> Accepted for a local single-player game; noted rather than solved.
- [Clock changes inflate the offline grant] -> Bounded by the cap; accepted at this scope.
- [Future state-shape changes invalidate old saves] -> Version field from day one; migrations become possible when wanted; the version-1 policy is deliberately fresh-start on unknown versions.
- [Manual reset destroys progress irrecoverably] -> Confirmation step; localStorage has no recycle bin.
