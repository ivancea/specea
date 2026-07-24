# Spec-Driven Workflow

Before any Specea workflow, read `.specea/config.md`. Use its configured language for specifications, specification paths, and Specea-facing output. The config itself is always written in English.

## Creating a Specification

1. Search existing specifications for the requested behavior, related terminology, and neighboring functionality.
2. Search related implementation and tests, including existing `spec:` annotations, to identify behavior already owned by a specification.
3. Decide whether the request creates distinct behavior or changes an existing living specification.
4. If an existing specification owns the behavior, update it instead of creating an overlapping one. If ownership or intent is ambiguous, explain the overlap and ask whether existing behavior should change or the new behavior is independent.
5. Choose any directory under `.specea/specs`, following the project's existing organization when practical. Its root file must be named `spec.md`, and that file path must not already be used by another specification.
6. Add YAML frontmatter whose `id` is `spec:` followed by the exact directory path relative to `.specea/specs`.
7. Describe the feature and give every requirement a unique valid name.
8. Inspect related tests before implementation to determine which existing behaviors must remain valid and which tests may need to change.
9. Implement the specification and add or update tests. Every test created specifically for the spec must annotate the full spec ID or narrowest applicable requirement ID.
10. Run relevant tests and review the result against the specification. Passing tests are evidence, not proof of complete coverage.
11. Re-read the finished specification, implementation, and tests together. Confirm that the specification describes the resulting behavior and that the tests neither omit important requirements nor assert behavior contradicted by the spec.

## Modifying a Specification

Before changing a specification or requirement, perform impact analysis:

1. Search the repository for the full spec ID and every affected requirement ID.
2. Read every directly related test and inspect the relevant implementation.
3. Check whether the proposed change contradicts tests or behavior associated with another specification.
4. If another specification is affected, inspect it and either update all affected living specs together or ask the user to resolve unclear ownership or intent.
5. Update the specification, implementation, and affected tests as one coherent behavior change.
6. Check both directions afterward: every annotation must still resolve, and the updated specification must account for the behavior asserted by its related tests.

Renaming, renumbering, or removing a requirement requires a repository-wide scan. Update or remove all references in the same change. Never silently reuse a requirement name for different behavior.

Moving or renaming a specification directory changes its canonical ID. Verify that the destination remains under `.specea/specs` and that its target `spec.md` does not already exist, then update the frontmatter ID and every repository reference in the same change.

When functionality is intentionally removed in full, delete its living specification, related tests, implementation, and all references in the same coherent change. Git retains the specification's history.

## Modifying a Test

Before modifying or deleting a test:

1. Open every specification and requirement annotated by the test.
2. If the test has no annotation but its expected behavior is changing, search for a relevant specification and add the missing annotation when one exists.
3. Determine whether only test implementation is changing or whether asserted behavior is changing.
4. If behavior changes, update the living specification and inspect other tests referencing the same spec or requirement.
5. Check whether the specification completely describes the resulting assertion. Update it when the test exposes missing intended behavior.
6. Preserve, update, add, or remove annotations so they accurately state what the resulting test verifies.

Do not change a failing or obsolete test merely to make the suite pass. Use its specification to determine whether implementation, test, or intended behavior should change.

## Modifying Related Code

When changing code associated with annotated tests, inspect those tests and their specifications before altering behavior. If all known specifications remain satisfied and related tests pass, a change may proceed even when the traceability graph is incomplete.

## Final Consistency Check

Before completing spec-driven work, verify:

- Every spec has a root `spec.md` in its own directory under `.specea/specs`, and all requirement names are valid and unique.
- Every `spec.md` declares the canonical ID derived from its exact directory path.
- Every new spec-driven test has an accurate `spec:` annotation.
- Every referenced spec, artifact, and requirement exists.
- No changed or removed canonical or requirement identifier has stale references.
- Related tests were considered when a spec changed.
- Related specs were considered when a test or behavior changed.
- Affected living specs, implementation, and tests describe the same current behavior.
- Relevant tests pass, while recognizing that passing tests alone do not prove full conformance.
