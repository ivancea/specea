---
name: specea
description: Applies Specea whenever work may affect living specifications, specified behavior, tests with spec annotations, or a repository containing .specea/specs. Use it to select the correct Specea workflow before changing behavior, tests, or specifications.
metadata:
  author: ivancea
  version: "0.1.0"
---

# Specea

Before changing specified behavior, inspect the relevant specs, every test that references them, and the related implementation. Keep living specs, tests, annotations, and implementation aligned.

- Use `spec-create` for distinct new behavior after checking for existing ownership.
- Use `spec-edit` to analyze and revise an existing living spec.
- Use `spec-implement` for implementation, test, or observable behavior changes.
- Use `spec-check` after changing specs or references.

Ask the user only when intended behavior, scope, or specification ownership is ambiguous.
