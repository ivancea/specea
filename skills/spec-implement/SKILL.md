---
name: spec-implement
description: Implements an existing Specea living specification while aligning implementation, tests, and spec annotations. Use when a user asks to implement, complete, or fix behavior defined by a Specea spec or requirement.
metadata:
  author: ivancea
  version: "0.1.0"
---

# Implement a Specea Specification

Implementation is complete only when the living specification, observable behavior, tests, and annotations agree.

## Scope

You may modify implementation, tests, the target living specification, and other affected specs. Update a spec without asking only when implementation reveals missing documentation of already established intent. Ask before making any new product decision or resolving ambiguous ownership.

## Investigate

1. Read repository guidance and any Specea documentation available in the project.
2. Resolve `spec:YYYY/MM/DD/<name>` to `.specs/YYYY/MM/DD/<name>/spec.md`, `#<requirement>` to the exact direct `###` child of `## Requirements`, and `/<relative-path>` from the specification directory. Verify the frontmatter `id` matches the path and read the complete spec plus relevant artifacts.
3. Search the entire repository for the full spec ID and every requirement ID in that spec.
4. Read all referenced tests, related unannotated tests, and relevant implementation before writing code.
5. Before modifying or deleting a test, resolve and read every spec and requirement annotated by that test, including section- or assertion-level annotations.
6. Search neighboring specifications for interaction, overlap, and constraints that must remain valid.
7. Compare the requested implementation with current behavior and identify the smallest coherent change.

If specifications conflict, ownership is unclear, or the implementation requires unspecified product behavior, present the conflict and ask one focused question.

## Implement

1. Change implementation and tests together.
2. Add or update tests for each important behavior affected by the change.
3. Place an ordinary `spec:` comment on every test created specifically for the spec. Use the narrowest accurate reference; a broad test may reference the full spec, and an interaction test may carry multiple explicit references.
4. Prefer a comment on the whole test. Place it beside a section or assertion only when that narrower placement is materially more accurate.
5. Use annotations only as verification claims, never merely to mark related code.
6. When changing expected behavior in an unannotated existing test, search for a relevant spec and add its missing annotation when one exists.
7. Update all affected living specs when the resulting established behavior is not accurately documented.
8. Run the smallest relevant test set, then broader checks warranted by the impact.
9. Do not weaken a failing or obsolete test merely to make the suite pass. Use its living spec to decide whether implementation, assertion, or intended behavior must change.
10. When functionality is intentionally removed in full, remove its living spec, related tests, implementation, and every repository reference in the same change.
11. For any renamed, renumbered, removed, or moved identifier, update or remove every repository reference in the same change and never reuse a removed identifier for different behavior.
12. For an explicitly requested spec move or rename, retain its original creation date, use an unused lower-case ASCII kebab-case destination, update its frontmatter ID, and update every repository reference.

## Complete

Before reporting completion:

- Verify every `spec:` reference in affected specs, tests, and artifacts resolves to an existing spec, artifact, or exact requirement heading.
- Verify every affected spec's frontmatter ID exactly matches its path.
- Verify every affected spec contains `## Requirements` and has valid, unique requirement names as direct `###` children.
- Search for stale references to any changed identifier.
- Compare each requirement with its tests and each related test with the spec it claims to verify.
- Confirm that tests do not assert behavior omitted from or contradicted by the living specs.
- Re-read specification, implementation, and tests as one change.
- Report tests run, results, and any requirement without direct test evidence.

Passing tests are evidence of conformance, not proof of complete specification coverage.
