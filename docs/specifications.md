# Specification Format

## Directory Structure

Specifications live under `.specea/specs`. Other Specea configuration and project data may live alongside `specs` under `.specea`. Organization inside `specs` is free as long as every specification has a root `spec.md` inside its own directory.

For example, a project may organize specifications by full creation date:

```text
.specea/specs/2026/07/22/implement-oauth/spec.md
```

Or directly by descriptive name:

```text
.specea/specs/implement-oauth/spec.md
```

Supporting artifacts live beside `spec.md` wherever the project places it:

```text
implement-oauth/
  spec.md
  example-response.json
  notes.md
```

Directory names should ideally contain only `a-z`, `A-Z`, `0-9`, `_`, and `-`. Other characters are allowed, but may produce IDs that look strange, are difficult to read, or are confusing in references.

The root `spec.md` declares its canonical ID in YAML frontmatter. The ID is `spec:` followed by the exact specification directory path relative to `.specea/specs`:

```markdown
---
id: "spec:2026/07/22/implement-oauth"
---
```

The `id` field is required and must exactly match the directory path. For example, `.specea/specs/implement-oauth/spec.md` declares `id: "spec:implement-oauth"`. Moving or renaming a specification directory changes its ID and requires updating its frontmatter and every reference. Supporting artifacts use their path relative to the specification directory:

```text
spec:2026/07/22/implement-oauth/example-response.json
```

Searching for the full ID finds the specification declaration and every reference to it.

## Requirements

Each `spec.md` describes one coherent part of the system at whatever level of detail is useful. It must contain an `## Requirements` section with a clearly identifiable set of requirements.

Each requirement is a `###` heading that is a direct child of `## Requirements`:

```markdown
---
id: "spec:2026/07/22/implement-oauth"
---

# OAuth Authentication

The application allows a user to authenticate through a configured OAuth
provider and safely handles the provider callback.

## Requirements

### reject-invalid-state

The application must reject callbacks whose state does not match the state
stored for the authentication attempt.

### exchange-code-once

An authorization code must not be exchanged more than once.
```

A requirement name is the exact heading text after `### `. It must be either a positive decimal number or a lower-case ASCII kebab-case name. Descriptive kebab-case names are recommended. Spaces, uppercase letters, punctuation, `/`, and `#` are not valid; there is no escaping or normalization.

Names must not be repeated within a specification. Once referenced by tests, a name is part of the requirement's ID and must not be renamed, renumbered, removed, or reused without finding and updating every existing reference.

Append the exact requirement name to the spec ID:

```text
spec:2026/07/22/implement-oauth#reject-invalid-state
spec:2026/07/22/implement-oauth#1
```

## Test Annotations

Tests use ordinary comments so the convention works with every language and test framework:

```typescript
// spec:2026/07/22/implement-oauth#reject-invalid-state
test("rejects a callback with an invalid state", () => {
  // ...
});
```

A `spec:` annotation is a verification claim: the annotated test, section, or assertion verifies the referenced behavior. Do not use it merely to say that code is related to a specification.

A test that verifies a specification broadly rather than one requirement may reference the specification itself:

```typescript
// spec:2026/07/22/implement-oauth
test("completes the OAuth login flow", () => {
  // ...
});
```

A test may reference multiple specifications or requirements when it genuinely verifies their interaction. Make each reference explicit and searchable.

An annotation should normally apply to the whole test. In exceptional cases it may appear next to a specific assertion or section when only that part verifies the behavior:

```typescript
test("handles the OAuth callback", () => {
  const result = handleCallback(callback);

  // spec:2026/07/22/implement-oauth#reject-invalid-state
  expect(result.error).toBe("invalid_state");
});
```

This placement is easier to overlook and can become detached during refactoring, but is valid when it makes the relationship more accurate. Bidirectional traceability is more important than forcing every reference to test level.

Projects may add framework-specific metadata or validation tooling, but plain comments are the portable baseline.
