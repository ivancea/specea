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

You may create a new `spec.md` and supporting artifacts under `.specea/specs`. Do not implement the specification or modify tests unless the user also asks for implementation. If an existing specification owns the behavior, stop this workflow and use `spec-edit` instead. If implementation is also requested, create the spec first and then follow the complete `spec-implement` workflow for its new ID.

## Investigate

1. Before any other action, read `.specea/config.md`. If it is missing, stop and use `specea-init`. Use its configured language for the specification, its directory path, and Specea-facing output; keep the config itself in English. Follow every project-specific additional instruction in the config.
2. Read repository guidance and any other Specea documentation available in the project.
3. Search `.specea/specs` by requested terminology, synonyms, neighboring features, and relevant domain concepts.
4. Search implementation and tests for the same concepts and for nearby `spec:` annotations.
5. Read plausible owning specs, their referenced tests, and relevant implementation.
6. Decide whether the request is new coherent behavior or a change to behavior already owned by a living spec.

If ownership, scope, or intended behavior is ambiguous, present the concrete overlap and ask one focused question. Never resolve a product decision by assumption.

## Create

1. Choose a directory under `.specea/specs` using the organization recorded in `.specea/config.md`. The specification root must be named `spec.md`, and that file path must not already exist.
2. Prefer directory names containing only `a-z`, `A-Z`, `0-9`, `_`, and `-`. Other characters are allowed but can make IDs strange or confusing.
3. Create `spec.md` with YAML frontmatter whose `id` is `spec:` followed by the exact directory path relative to `.specea/specs`.
4. Search all `.specea/specs/**/spec.md` frontmatter and verify that the resulting canonical ID is unique.
5. Add a descriptive title, a short explanation of the intended behavior, and an `## Requirements` section.
6. Make every requirement a direct `###` child of `## Requirements`.
7. Use unique lower-case ASCII kebab-case requirement names, or positive decimal names when the project intentionally uses numeric requirements. Names are exact identifiers and are not normalized.
8. State observable intended behavior without inventing implementation details that the user did not require.

For `.specea/specs/<path>/spec.md`, the canonical ID is `spec:<path>`. A requirement ID is `spec:<path>#<requirement-name>`, and a supporting artifact is `spec:<path>/<relative-artifact-path>`.

## Complete

Before reporting completion:

- Recheck that no existing specification owns overlapping behavior.
- Verify that the root `spec.md` is inside its own directory under `.specea/specs`, requirement names are valid and unique, and the frontmatter ID exactly matches the directory path.
- Verify every `spec:` reference in the new specification and its artifacts resolves.
- Re-read the spec for internal consistency and unresolved product choices.
- Report the canonical spec ID and any supporting artifacts created.
