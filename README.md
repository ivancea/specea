# Specea

Specea is an installable workflow for keeping living specifications, tests, and implementation aligned. Specifications record current intended behavior in the repository, while ordinary test comments annotate exactly which behavior each test verifies.

```typescript
// spec:2026/07/22/implement-oauth#reject-invalid-state
test("rejects a callback with an invalid state", () => {
  // ...
});
```

These annotations work in any language or test framework. From a test, the comment points to its reason for existing; from a specification, repository search finds the tests that claim to protect it. Agents inspect both directions before changing behavior and update the specification, tests, and implementation together.

## Installation

Choose the installation method that best fits your project and workflow:

### APM

First install [APM](https://github.com/microsoft/apm). Then run this command from your project root to add Specea to the project and install all its skills:

```shell
apm install ivancea/specea
```

The equivalent minimal `apm.yml` is:

```yaml
name: my-project
version: "0.1.0"

targets:
  - opencode

dependencies:
  apm:
    - ivancea/specea
```

With that manifest in place, install its dependencies with:

```shell
apm install
```

### npx skills

With Node.js installed, use [`skills`](https://github.com/vercel-labs/skills) without installing another CLI. Select the agents and project-level installation when prompted:

```shell
npx skills add ivancea/specea
```

## Usage

Ask the agent to create, edit, or implement a specification as part of the task. The installed skill should be selected from the request and repository context; canonical IDs may be used to target an existing spec directly.

```text
Create a Specea spec for expiring inactive sessions.
Edit spec:2026/07/22/implement-oauth to require PKCE.
Implement spec:2026/07/22/implement-oauth#reject-invalid-state.
```

The package provides these skills:

- `spec-create` investigates existing behavior and creates a specification only when no existing spec owns it.
- `spec-edit` performs impact analysis before changing a living specification.
- `spec-implement` implements a specification and keeps its tests and annotations aligned.

## Specification IDs

Specifications live in a creation-date path under `.specs`:

```text
.specs/2026/07/22/implement-oauth/spec.md
```

Its `spec.md` declares the stable ID in YAML frontmatter:

```markdown
---
id: "spec:2026/07/22/implement-oauth"
---
```

The declared ID must match the specification's creation-date path.

Requirements are `###` headings directly below the specification's `## Requirements` section. Appending the requirement name creates a requirement ID:

```markdown
---
id: "spec:2026/07/22/implement-oauth"
---

## Requirements

### reject-invalid-state

The application must reject callbacks whose state does not match the state
stored for the authentication attempt.
```

```text
spec:2026/07/22/implement-oauth#reject-invalid-state
```

The creation date and identifiers remain stable as the living specification changes. Git retains the history.

## Documentation

- [Specification format and annotations](docs/specifications.md)
- [Spec-driven workflow](docs/workflow.md)

Specea intentionally permits unspecified and untested behavior. Its purpose is to make known intent and known verification relationships discoverable, not to claim that missing links prove there is no impact.
