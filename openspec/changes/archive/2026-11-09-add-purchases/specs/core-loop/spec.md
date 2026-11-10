# Spec Delta

## Purpose

The player-facing resource of the incremental game and the ways it grows, beginning with manual gain through the gain control and the immediate on-screen presentation of the resource value.

## ADDED Requirements

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
