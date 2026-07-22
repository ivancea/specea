---
name: spec-edit
description: Performs impact analysis and safely edits an existing Specea living specification and its references. Use when intended behavior, requirements, identifiers, or supporting artifacts in an existing Specea spec must change.
metadata:
  author: ivancea
  version: "0.1.0"
---

# Edit a Specea Specification

Treat a living specification and every test that claims to verify it as one impact surface.

## Scope

You may edit the target specification and supporting artifacts. You may update annotation references required by renamed, renumbered, removed, moved, or deleted identifiers. Do not alter implementation behavior or test assertions unless the user also asks for implementation; use `spec-implement` for that work.

## Resolve and Inspect

1. Read repository guidance and any Specea documentation available in the project.
2. Resolve `spec:YYYY/MM/DD/<name>` to `.specs/YYYY/MM/DD/<name>/spec.md` and verify that its frontmatter `id` matches. Resolve an optional `#<requirement>` as the exact `###` heading directly under `## Requirements`.
3. Search the entire repository for the full spec ID and all affected requirement IDs before editing.
4. Read every directly related test and inspect relevant implementation.
5. Search other specs for affected concepts, dependencies, contradictory behavior, and overlapping ownership.
6. Compare the requested behavior with what the current spec and tests assert.

If the change creates unclear ownership, contradicts another spec, or requires a product choice not supplied by the user, explain the exact conflict and ask one focused question before editing.

## Edit

1. Keep the creation-date path stable unless moving it is explicitly required.
2. Preserve requirement identifiers unless renaming, renumbering, or removal is intentional.
3. Keep requirement names unique and either lower-case ASCII kebab-case or positive decimals. The heading text is the exact identifier; no normalization applies.
4. Update every stale annotation in the same change when an identifier changes.
5. Never reuse a removed identifier for different behavior.
6. If functionality is removed entirely, remove its spec and all references only as part of the same coherent removal.

## Complete

Before reporting completion:

- Search old and new IDs to prove that no stale references remain.
- Verify that every affected spec's frontmatter ID exactly matches its path.
- Verify every resulting `spec:` reference resolves to an existing spec, artifact, or requirement.
- Compare the resulting spec with all directly related tests in both directions.
- Identify implementation or test behavior that must still change, or use `spec-implement` if that work was requested.
- Report changed identifiers and affected files.
