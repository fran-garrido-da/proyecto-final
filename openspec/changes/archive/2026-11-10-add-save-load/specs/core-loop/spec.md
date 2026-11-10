# Spec Delta

## MODIFIED Requirements

### Requirement: Initial resource state
Every new game SHALL begin with the resource at zero and the per-click gain at one. A session that begins with a valid save SHALL instead start from the saved state, as defined by the persistence capability.

#### Scenario: Session start
- **WHEN** a new game begins
- **THEN** the resource is 0 and the per-click gain is 1

#### Scenario: Initial display
- **WHEN** a new game begins
- **THEN** the resource display shows 0

### Requirement: Initial production rate
Every new game SHALL begin with a per-second production rate of zero. A session restored from a valid save SHALL instead derive its rate from the saved owned items.

#### Scenario: Session start
- **WHEN** a new game begins
- **THEN** the per-second production rate is 0 and the resource does not grow on its own
