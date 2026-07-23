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

You may edit the target specification, supporting artifacts, every clearly affected living spec, and all references required by identifier changes. A documentation correction that records already-established behavior may remain spec-only. If intended observable behavior changes, do not complete a spec-only edit: continue under `spec-implement` or ask the user to authorize the coherent implementation and test changes.

## Resolve and Inspect

1. Before any other action, read `.specea/config.md`. If it is missing, stop and use `specea-init`.
2. Read repository guidance and any other Specea documentation available in the project.
3. Resolve `spec:<path>` by finding the matching frontmatter `id` under `.specea/specs/**/spec.md`. Resolve `#<requirement>` as the exact direct `###` child of `## Requirements`, and resolve `/<relative-path>` from that specification's directory.
4. Search the entire repository for the full spec ID and all affected requirement IDs before editing.
5. Read every directly related test and inspect relevant implementation.
6. Search other specs for affected concepts, dependencies, contradictory behavior, and overlapping ownership.
7. Compare the requested behavior with what the current spec and tests assert.

If the change creates unclear ownership, contradicts another spec, or requires a product choice not supplied by the user, explain the exact conflict and ask one focused question before editing.

## Edit

1. For a directory rename or move, keep `spec.md` as the root filename, require that the target file does not already exist under `.specea/specs`, derive the new ID from the destination path, and update the frontmatter and every reference.
2. Preserve requirement identifiers unless renaming, renumbering, or removal is intentional.
3. Keep requirement names unique and either lower-case ASCII kebab-case or positive decimals. The heading text is the exact identifier; no normalization applies.
4. Changing a canonical path, or renaming, renumbering, or removing a requirement, requires a repository-wide search. Update every reference in the same change.
5. Never reuse a removed identifier for different behavior.
6. Update every clearly affected living specification together. Ask only when ownership, intent, or the correct cross-spec result is ambiguous.
7. If functionality is removed entirely, continue under `spec-implement`; do not delete only its specification or references.

## Complete

Before reporting completion:

- Search old and new IDs to prove that no stale references remain.
- Verify that every affected spec's frontmatter ID exactly matches its directory path.
- Verify every affected spec contains `## Requirements` and has valid, unique requirement names as direct `###` children.
- Verify every resulting `spec:` reference resolves to an existing spec, artifact, or requirement.
- Compare the resulting spec with all directly related tests in both directions.
- Identify implementation or test behavior that must still change, or use `spec-implement` if that work was requested.
- Report changed identifiers and affected files.
