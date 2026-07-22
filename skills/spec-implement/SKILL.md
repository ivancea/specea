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
2. Resolve the requested spec or requirement, verify that its frontmatter `id` matches its path, and read the complete `spec.md` plus relevant supporting artifacts.
3. Search the entire repository for the full spec ID and every requirement ID in that spec.
4. Read all referenced tests, related unannotated tests, and relevant implementation before writing code.
5. Search neighboring specifications for interaction, overlap, and constraints that must remain valid.
6. Compare the requested implementation with current behavior and identify the smallest coherent change.

If specifications conflict, ownership is unclear, or the implementation requires unspecified product behavior, present the conflict and ask one focused question.

## Implement

1. Change implementation and tests together.
2. Add or update tests for each important behavior affected by the change.
3. Place an ordinary `spec:` comment on every test created specifically for the spec. Reference the narrowest accurate requirement ID.
4. Prefer a comment on the whole test. Place it beside a section or assertion only when that narrower placement is materially more accurate.
5. Use annotations only as verification claims, never merely to mark related code.
6. When changing expected behavior in an unannotated existing test, search for a relevant spec and add its missing annotation when one exists.
7. Update all affected living specs when the resulting established behavior is not accurately documented.
8. Run the smallest relevant test set, then broader checks warranted by the impact.

## Complete

Before reporting completion:

- Verify every new or changed annotation resolves to an existing spec or exact requirement heading.
- Verify every affected spec's frontmatter ID exactly matches its path.
- Search for stale references to any changed identifier.
- Compare each requirement with its tests and each related test with the spec it claims to verify.
- Confirm that tests do not assert behavior omitted from or contradicted by the living specs.
- Re-read specification, implementation, and tests as one change.
- Report tests run, results, and any requirement without direct test evidence.

Passing tests are evidence of conformance, not proof of complete specification coverage.
