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
2. Determine the project language. If the initialization request is in English, use English without asking. If the request is primarily in another language, ask which language to use for specification content and specification paths.
3. Ask the user how specification directories should be organized beneath `.specea/specs`. Ask for a relative pattern ending in the specification directory, such as `YYYY/MM/<name>`, `YYYY/MM/DD/<name>`, or `<name>`. Accept a custom organization.
4. Ask whether the user wants additional instructions for Specea work in this project. Accept any free-form guidance that helps define how agents should create, edit, implement, or validate specifications.
5. Create the `.specea/specs` directory.
6. Create `.specea/config.md` using this structure, replacing the language, explanation, and example pattern with the user's choices. If the user provided additional instructions, append them in the final section shown below:

```markdown
# Specea project config

## Language

Specs and specification paths are written in English.

## Specs organization

Specs are within a folder structure starting with the full year, then the month (0-padded), then a short spec description: `YYYY/MM/my-spec/spec.md`

## Additional instructions

<free-form project instructions>
```

The recorded path is relative to `.specea/specs`. Always write the config headings and explanatory text in English, including the English name of the chosen language. All other Specea artifacts and Specea-facing output use the configured language. Additional instructions may contain any guidance relevant to Specea work and must always be the final `##` section. Omit that section when the user provides no additional instructions.

Before completion, verify that `.specea/specs` exists and that the config accurately describes the chosen language, organization, and any additional instructions.
