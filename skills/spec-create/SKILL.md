---
name: spec-create
description: Investigates a requested behavior and creates a new Specea living specification only when an existing spec does not already own it. Use when a user asks to specify, design, or document new intended behavior using Specea.
metadata:
  author: ivancea
  version: "0.1.0"
---

# Create a Specea Specification

Create a specification only after establishing that the requested behavior is distinct from existing specification ownership.

## Scope

You may create a new `.specs/YYYY/MM/DD/<name>/spec.md` and supporting artifacts. Do not implement the specification or modify tests unless the user also asks for implementation. If an existing specification owns the behavior, stop this workflow and use `spec-edit` instead. If implementation is also requested, create the spec first and then follow the complete `spec-implement` workflow for its new ID.

## Investigate

1. Read repository guidance and any Specea documentation available in the project.
2. Search `.specs` by requested terminology, synonyms, neighboring features, and relevant domain concepts.
3. Search implementation and tests for the same concepts and for nearby `spec:` annotations.
4. Read plausible owning specs, their referenced tests, and relevant implementation.
5. Decide whether the request is new coherent behavior or a change to behavior already owned by a living spec.

If ownership, scope, or intended behavior is ambiguous, present the concrete overlap and ask one focused question. Never resolve a product decision by assumption.

## Create

1. Use the current local date for `.specs/YYYY/MM/DD/`.
2. Choose a concise, unique, lower-case ASCII kebab-case directory name.
3. Verify the complete path is unused before writing.
4. Create `spec.md` with YAML frontmatter containing `id: "spec:YYYY/MM/DD/<name>"`. The value must exactly match the creation-date path.
5. Add a descriptive title, a short explanation of the intended behavior, and an `## Requirements` section.
6. Make every requirement a direct `###` child of `## Requirements`.
7. Use unique lower-case ASCII kebab-case requirement names, or positive decimal names when the project intentionally uses numeric requirements. Names are exact identifiers and are not normalized.
8. State observable intended behavior without inventing implementation details that the user did not require.

The canonical ID is `spec:YYYY/MM/DD/<name>`. A requirement ID is `spec:YYYY/MM/DD/<name>#<requirement-name>`.
Supporting artifacts are referenced as `spec:YYYY/MM/DD/<name>/<relative-path>`.

## Complete

Before reporting completion:

- Recheck that no existing specification owns overlapping behavior.
- Verify that the path and requirement names are valid and unique and that the frontmatter ID matches the path.
- Verify every `spec:` reference in the new specification and its artifacts resolves.
- Re-read the spec for internal consistency and unresolved product choices.
- Report the canonical spec ID and any supporting artifacts created.
