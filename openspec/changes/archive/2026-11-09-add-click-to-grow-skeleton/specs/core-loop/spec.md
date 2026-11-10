# Spec Delta

## Purpose

The player-facing resource of the incremental game and the ways it grows, beginning with manual gain through the gain control and the immediate on-screen presentation of the resource value.

## ADDED Requirements

### Requirement: Initial resource state
Every fresh game session SHALL begin with the resource at zero and the per-click gain at one.

#### Scenario: Session start
- **WHEN** a fresh session begins
- **THEN** the resource is 0 and the per-click gain is 1

#### Scenario: Initial display
- **WHEN** a fresh session begins
- **THEN** the resource display shows 0

### Requirement: Manual resource gain
Each activation of the gain control SHALL increase the resource by the current per-click gain.

#### Scenario: First activation
- **WHEN** the resource is 0 and the per-click gain is 1
- **THEN** after one activation of the gain control the resource is 1

#### Scenario: Repeated rapid activation
- **WHEN** the player activates the gain control 10 times in rapid succession
- **THEN** the resource increases by exactly 10 times the per-click gain

### Requirement: Resource display reflects the current value
The resource display SHALL show the current resource value, reflecting each change by the end of the interaction that caused it.

#### Scenario: Display follows an activation
- **WHEN** the player activates the gain control
- **THEN** the display immediately shows the new resource value

#### Scenario: Display after rapid activation
- **WHEN** the player activates the gain control 10 times in rapid succession
- **THEN** the display ends up showing exactly the resource value produced by those activations
