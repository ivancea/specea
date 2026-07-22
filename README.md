# Specea

## Summary

### What

Living specifications describe current intended behavior, while test comments identify the specifications or requirements they verify. Agents inspect both directions before changing either side. Specs, tests, and implementation are updated together, and Git retains their history.

### Why

This makes it easy to find which specs a test protects and which tests must be reviewed when a spec changes. Before editing either one, agents compare the spec and its tests so they remain complete and in sync.

## Spec Structure

Specifications live under `.specs` and are partitioned by creation date:

```text
.specs/
  2026/
    07/
      22/
        implement-oauth/
          spec.md
          example-response.json
          notes.md
```

The directory name must be short, descriptive, and unique. The date is the specification's creation date and never changes, even when the specification is later updated.

The specification above has this ID:

```text
spec:2026/07/22/implement-oauth
```

The ID maps to the directory `.specs/2026/07/22/implement-oauth/` and refers to its root `spec.md` by default. Other files in the directory are supporting artifacts and can be referenced explicitly when needed.

This format makes references understandable in code and easy to locate. Searching for `2026/07/22/implement-oauth` finds both the specification directory and references to it.

## Spec Content

Each `spec.md` describes one coherent part of the system at whatever level of detail is useful. It should explain the feature and contain a clearly identifiable set of requirements.

```markdown
# OAuth Authentication

The application allows a user to authenticate through a configured OAuth
provider and safely handles the provider callback.

## Requirements

### reject-invalid-state

The application must reject callbacks whose state does not match the state
stored for the authentication attempt.

### exchange-code-once

An authorization code must not be exchanged more than once.

### refresh-expired-token

The application must use a refresh token when the access token has expired.
```

A requirement's heading is its name within the specification. Requirement names may be short descriptions, numbers, or another project-defined format:

```markdown
### reject-invalid-state
```

```markdown
### 1
```

Requirement names must not be repeated within a specification. Once referenced by tests, a name is part of the requirement's ID and must not be renamed, renumbered, removed, or reused without finding and updating every existing reference.

A requirement is referenced by appending its name to the spec ID:

```text
spec:2026/07/22/implement-oauth#reject-invalid-state
spec:2026/07/22/implement-oauth#1
```

Tests use ordinary comments so the convention works with every language and test framework:

```typescript
// spec:2026/07/22/implement-oauth#reject-invalid-state
test("rejects a callback with an invalid state", () => {
  // ...
});
```

A test that verifies the specification broadly rather than one requirement may reference the spec itself:

```typescript
// spec:2026/07/22/implement-oauth
test("completes the OAuth login flow", () => {
  // ...
});
```

A test may reference multiple specifications or requirements when it genuinely verifies their interaction. Each reference should be explicit and searchable.

A `spec:` comment should normally annotate the test as a whole. In exceptional cases, it may instead be placed next to a specific assertion or section of the test when only that part verifies the referenced behavior:

```typescript
test("handles the OAuth callback", () => {
  const result = handleCallback(callback);

  // spec:2026/07/22/implement-oauth#reject-invalid-state
  expect(result.error).toBe("invalid_state");
});
```

This is less desirable because references inside a test are easier to overlook and can become detached from the relevant assertion during refactoring. It is nevertheless valid when it makes the relationship more accurate. Bidirectional traceability is more important than requiring every reference to appear at test level.

These references create a bidirectional relationship:

- From a test, its comment identifies the behavior that justifies the test.
- From a specification or requirement, repository search finds the tests that claim to verify it.

Projects may add framework-specific metadata or validation tooling, but plain comments are the portable baseline.

## Workflow

### Creating a New Spec

1. Search existing specifications for the requested behavior, related terminology, and neighboring functionality.
2. Search related implementation and tests, including existing `spec:` comments, to identify behavior already owned by a specification.
3. Decide whether the request creates distinct behavior or changes behavior in an existing living specification.
4. If an existing specification owns the behavior, update that specification instead of creating an overlapping one. If ownership or intent is ambiguous, explain the overlap and ask the user whether the existing behavior should change or the new behavior is independent.
5. If a new specification is appropriate, create `.specs/YYYY/MM/DD/unique-description/spec.md`. Choose a concise description that communicates the feature and does not conflict with another spec created on the same date.
6. Describe the feature and give every requirement a unique heading or name. Prefer short descriptive names where readability is useful; numeric names are also valid.
7. Inspect related tests before implementation. Determine which existing behaviors must remain valid and which tests may need to change.
8. Implement the specification and add or update tests. Every test created specifically for the spec must contain a comment referencing the full spec ID or the narrowest applicable requirement ID.
9. Run the relevant tests and review the result against the specification. Passing tests are evidence, not proof of complete specification coverage.
10. Re-read the finished specification, implementation, and tests together. Check that the specification describes the resulting intended behavior, that tests cover its important requirements, and that tests do not assert behavior omitted or contradicted by the spec.

### Modifying a Spec

Before changing a specification or requirement, an agent must perform impact analysis:

1. Search the repository for the full spec ID and any affected requirement IDs.
2. Read every directly related test and inspect the relevant implementation.
3. Check whether the proposed change contradicts tests or behavior associated with another specification.
4. If another specification is affected, inspect it and either update all affected living specs together or ask the user to resolve unclear ownership or intent.
5. Update the specification, implementation, and affected tests as one coherent change.
6. Afterward, check both directions for completeness: all referenced requirements must still exist, and the updated specification must still account for the behavior asserted by its related tests.

Renaming, renumbering, or removing a requirement requires a repository-wide scan. All references must be updated or removed in the same change. Requirement names must never be silently reused for different behavior.

Moving or renaming a specification directory has the same requirement: find and update every reference. Prefer keeping the original creation path stable.

### Modifying a Test

Before modifying or deleting a test with a `spec:` reference, an agent must:

1. Open the referenced specification and requirement.
2. Determine whether the test is changing only its implementation or whether its asserted behavior is changing.
3. If behavior is changing, update the living specification and inspect other tests referencing the same spec or requirement.
4. Check whether the specification is complete enough to describe the behavior the modified test asserts. Update the spec when the test exposes a missing intended requirement.
5. Preserve, update, or remove the reference so that it accurately describes what the resulting test verifies.

A failing or obsolete test must not be changed merely to make the suite pass. Its referenced specification is the source for determining whether the implementation, the test, or the intended behavior should change.

### Modifying Related Code

When changing code associated with referenced tests, agents should inspect those tests and their specifications before altering behavior. If all known specifications remain satisfied and related tests pass, the change may proceed even when the traceability graph is incomplete.

This framework accepts that unspecified or untested behavior can exist. Its purpose is to make known intent and known verification relationships easy to discover, not to imply that the absence of a link proves the absence of an impact.

### Final Consistency Check

Before completing spec-driven work, the agent must verify:

- The spec path and all requirement names are unique.
- Every new spec-driven test has an accurate `spec:` comment.
- Every referenced spec and requirement exists.
- No renamed, renumbered, or removed identifier has stale references.
- Related tests were considered when a spec changed.
- Related specs were considered when a test or behavior changed.
- Affected living specs, implementation, and tests describe the same current behavior.
- Relevant tests pass, while recognizing that passing tests alone do not prove full conformance.
