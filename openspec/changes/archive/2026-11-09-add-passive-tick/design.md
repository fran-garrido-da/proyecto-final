# Design

## Context

Builds on add-click-to-grow-skeleton, which establishes state mutated through a single entry point with render-on-change. That render model reacts only to clicks; this change adds the time-driven path. See proposal.md for motivation. Must be implemented after add-click-to-grow-skeleton.

## Goals / Non-Goals

**Goals:**
- Time-driven growth that stays accurate under real browser conditions (throttled background tabs, imprecise timers).
- Passive updates flowing through the same state entry point so rendering stays centralized.
- A zero initial rate so every skeleton scenario keeps passing unchanged.

**Non-Goals:**
- Nothing raises the rate above 0; that is the purchases change.
- No save/load and no offline accumulation (the save-load change will reuse the same math).
- No number formatting.

## Decisions

- **Delta-time accumulation, not fixed ticks.** A timer fires regularly (default roughly ten times per second); each fire adds elapsed wall-clock time since the previous fire multiplied by the per-second rate. Alternatives: a fixed "+rate per second" step (drifts, and browsers throttle background timers to roughly once a minute, stalling hidden-tab growth); requestAnimationFrame-driven updates (pause entirely when the tab is hidden). Wall-clock deltas keep growth accurate regardless of throttling, and the same elapsed-times-rate math is exactly what future offline progress needs.
- **Fractional resources internally, whole numbers displayed.** Rates like 0.5/s must not round growth away; state holds a float and the display floors it. Alternative — integer ticks with a remainder carry — rejected as extra state for no visible benefit.
- **The rate lives in state, starts at 0, and is mutated only through the existing entry point.** The timer calls the same mutate-and-render path that clicks use, so no parallel render path exists. (The later purchases change will supersede the stored rate with a value derived from owned items; that supersession is documented there.)
- **Timer cadence is a tunable constant (~100ms), not spec behavior.** It buys smoothness at common rates; adjusting it changes no observable requirement.

## Risks / Trade-offs

- [Background-tab timer throttling distorts growth] -> Mitigated by design: delta-time catches up on the next fire; wall-clock is the source of truth.
- [System clock changes (manual set, NTP) distort elapsed time] -> Accepted at this scope; a per-fire maximum clamp is a one-line guard if it ever matters.
- [Float accumulation drift over very long sessions] -> Display flooring hides it; magnitudes stay far below precision limits for this project's lifespan.
