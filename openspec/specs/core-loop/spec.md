# core-loop Specification

## Purpose

The player-facing resource of the incremental game and the ways it grows, beginning with manual gain through the gain control and the immediate on-screen presentation of the resource value.

## Requirements

### Requirement: Initial resource state
Every new game SHALL begin with the resource at zero and the per-click gain at one. A session that begins with a valid save SHALL instead start from the saved state, as defined by the persistence capability.

#### Scenario: Session start
- **WHEN** a new game begins
- **THEN** the resource is 0 and the per-click gain is 1

#### Scenario: Initial display
- **WHEN** a new game begins
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

### Requirement: Initial production rate
Every new game SHALL begin with a per-second production rate of zero. A session restored from a valid save SHALL instead derive its rate from the saved owned items.

#### Scenario: Session start
- **WHEN** a new game begins
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

### Requirement: New game owns no items
Every new game SHALL begin owning zero of every purchasable item.

#### Scenario: Session start
- **WHEN** a new game begins
- **THEN** every item's owned count is 0, the per-click gain is 1, and the per-second rate is 0

### Requirement: Geometric item costs
The cost of an item's next purchase SHALL be its base cost multiplied by its cost growth raised to the number already owned, rounded to a whole number.

#### Scenario: First purchase cost
- **WHEN** an item has base cost 15, growth 1.15, and is owned 0 times
- **THEN** its current cost is 15

#### Scenario: Cost grows with ownership
- **WHEN** an item has base cost 15, growth 1.15, and is owned 10 times
- **THEN** its current cost is 61

### Requirement: Atomic purchase
Buying an item SHALL, in one step, require the current cost, deduct it from the resource, and increment the item's owned count.

#### Scenario: Successful purchase
- **WHEN** the resource is at least the item's current cost and the player buys it
- **THEN** the resource decreases by exactly the cost and the owned count increases by 1

#### Scenario: Insufficient resource
- **WHEN** the resource is less than the item's current cost and the player attempts to buy it
- **THEN** the resource, the owned count, and all derived rates are unchanged

### Requirement: Generators add production rate
Each owned generator SHALL add its production rate to the per-second rate.

#### Scenario: Owning multiple generators
- **WHEN** a generator with production rate 0.5 is owned 3 times
- **THEN** the per-second rate is 1.5

### Requirement: Click upgrades add manual gain
Each owned click upgrade SHALL add its gain amount to the per-click gain.

#### Scenario: Owning click upgrades
- **WHEN** the per-click gain starts at 1 and a click upgrade with gain 1 is owned 2 times
- **THEN** the per-click gain is 3

### Requirement: Purchase controls show affordability
Each purchasable item SHALL display its name, current cost, and owned count, and SHALL indicate whether it is currently affordable, updating as the resource changes.

#### Scenario: Affordability updates from clicking
- **WHEN** an item is unaffordable and the player clicks until the resource reaches the cost
- **THEN** the item is shown as affordable without a reload

#### Scenario: Affordability updates from passive growth
- **WHEN** an item is unaffordable and passive growth raises the resource to the cost
- **THEN** the item is shown as affordable without player interaction
