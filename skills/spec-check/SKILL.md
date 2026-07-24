---
name: spec-check
description: Validates Specea specification paths, frontmatter IDs, requirement names, and spec references without depending on a language or test framework. Use after changing specifications, annotations, or supporting artifacts.
compatibility: Requires Node.js 18 or newer.
metadata:
  author: ivancea
  version: "0.1.0"
---

# Check Specea Specifications

Before any other action, read `.specea/config.md`. If it is missing, stop and use `specea-init`. Present the check result in its configured language; keep the config itself in English. Follow every project-specific additional instruction in the config.

Run the bundled validator with the repository root as its argument:

```shell
node <skill-directory>/scripts/spec-check.mjs <repository-root>
```

Resolve `<skill-directory>` to the directory containing this `SKILL.md`. If the command fails, confirm and fix every reported project inconsistency, then run it again. Validate nested example or package projects separately by passing their own root directory.

The validator checks that:

- Every specification has a root `.specea/specs/**/spec.md` inside its own directory and a frontmatter `id` that exactly matches that directory path.
- Requirement headings are valid and unique direct children of `## Requirements`.
- Every discovered `spec:` reference is canonical and resolves to an existing spec, requirement, or supporting artifact.

After it passes, still compare the affected specs and tests manually. Mechanical validation cannot prove that tests correctly or completely verify intended behavior.
