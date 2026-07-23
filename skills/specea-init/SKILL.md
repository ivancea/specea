---
name: specea-init
description: Initializes Specea in a repository by choosing the specification directory organization and creating .specea/specs plus .specea/config.md. Use when setting up Specea for a project or when its config is missing.
metadata:
  author: ivancea
  version: "0.1.0"
---

# Initialize Specea

Initialize only the Specea project structure and configuration. Do not create a specification or modify application code.

1. Check whether `.specea/config.md` already exists. If it does, read it and ask before replacing or changing the existing setup.
2. Ask the user how specification directories should be organized beneath `.specea/specs`. Ask for a relative pattern ending in the specification directory, such as `YYYY/MM/<name>`, `YYYY/MM/DD/<name>`, or `<name>`. Accept a custom organization.
3. Create the `.specea/specs` directory.
4. Create `.specea/config.md` using this structure, replacing the explanation and example pattern with the user's choice:

```markdown
# Specea project config

## Specs organization

Specs are within a folder structure starting with the full year, then the month (0-padded), then a short spec description: `YYYY/MM/my-spec/spec.md`
```

The recorded path is relative to `.specea/specs`. Keep the config concise; do not add sections the user did not request.

Before completion, verify that `.specea/specs` exists and that the config accurately describes the chosen organization.
