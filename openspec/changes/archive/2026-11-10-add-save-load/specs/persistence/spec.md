# Spec Delta

## Purpose

Saving, restoring, and protecting game progress across sessions: automatic and manual saving, safe restoration of valid saves, capped offline progress, and reset.

## ADDED Requirements

### Requirement: Automatic saving
The game SHALL save the current state automatically at a regular interval and when the page is hidden or closed, and SHALL provide a manual save control.

#### Scenario: Interval save
- **WHEN** the state has changed and the save interval has elapsed
- **THEN** the stored save reflects the current state

#### Scenario: Save on page hide
- **WHEN** the page is hidden or closed
- **THEN** the current state is saved before the session ends

#### Scenario: Manual save
- **WHEN** the player activates the manual save control
- **THEN** the stored save reflects the state at that moment

### Requirement: State restoration
A session that begins with a valid save SHALL restore the saved resource and owned items, with rates derived from them.

#### Scenario: Reload resumes progress
- **WHEN** the page is reloaded after progress was made and saved
- **THEN** the resource and owned counts match the save and the rates are derived from them

### Requirement: New game without a save
A session that begins with no save present SHALL start a new game.

#### Scenario: First load
- **WHEN** no save exists in storage
- **THEN** the game starts with resource 0, per-click gain 1, per-second rate 0, and nothing owned

### Requirement: Invalid saves fall back to a new game
A save that is unparseable or invalid SHALL be rejected in favor of a new game.

#### Scenario: Unparseable save
- **WHEN** the stored save is not valid JSON
- **THEN** a new game begins

#### Scenario: Out-of-range values
- **WHEN** the stored save contains a non-finite or negative resource, or a negative or non-integer owned count
- **THEN** a new game begins

#### Scenario: Unknown item
- **WHEN** the stored save contains an owned count for an item that is not in the catalog
- **THEN** a new game begins

#### Scenario: Unknown save version
- **WHEN** the stored save's format version is not the current version
- **THEN** a new game begins

### Requirement: Offline progress on restore
Restoring a save SHALL grant the elapsed time since the save multiplied by the rate derived from it, capped at a maximum.

#### Scenario: Short absence
- **WHEN** a save with derived per-second rate 2 is restored 10 seconds after it was saved
- **THEN** the restored resource includes 20 from offline progress

#### Scenario: Long absence is capped
- **WHEN** a save with derived per-second rate 2 is restored 24 hours after it was saved and the cap is 8 hours
- **THEN** the offline grant equals 2 multiplied by 8 hours, not the full 24

#### Scenario: No production
- **WHEN** a save with derived per-second rate 0 is restored after any absence
- **THEN** no offline progress is granted

### Requirement: Hard reset
The player SHALL be able to clear the stored save and start a new game.

#### Scenario: Reset control
- **WHEN** the player activates the reset control and confirms
- **THEN** the save is removed and a new game begins immediately
