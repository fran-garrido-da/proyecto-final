# Spec Delta

## Purpose

The player-facing resource of the incremental game and the ways it grows, beginning with manual gain through the gain control and the immediate on-screen presentation of the resource value.

## ADDED Requirements

### Requirement: Initial production rate
Every fresh game session SHALL begin with a per-second production rate of zero.

#### Scenario: Session start
- **WHEN** a fresh session begins
- **THEN** the per-second production rate is 0 and the resource does not grow on its own

### Requirement: Passive resource growth
While a session is open, the resource SHALL increase over elapsed time by the current per-second production rate.

#### Scenario: Growth over one second
- **WHEN** the per-second rate is 1 and one second of session time elapses
- **THEN** the resource has increased by 1

#### Scenario: Growth over a longer period
- **WHEN** the per-second rate is 0.5 and ten seconds of session time elapse
- **THEN** the resource has increased by 5

#### Scenario: Zero rate
- **WHEN** the per-second rate is 0 and time elapses
- **THEN** the resource does not change on its own

### Requirement: Passive growth combines with manual gain
Passive growth and manual gain SHALL accumulate into the same resource.

#### Scenario: Click during passive growth
- **WHEN** the per-click gain is 1, the per-second rate is 1, the player clicks once, and one second elapses
- **THEN** the resource has increased by 2 in total

### Requirement: Display tracks passive growth
The resource display SHALL continue to show the current resource value as it grows passively, without player interaction.

#### Scenario: Unattended display update
- **WHEN** the per-second rate is 1 and the player does not interact
- **THEN** the displayed value increases over time
