import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const validator = resolve(dirname(fileURLToPath(import.meta.url)), "../scripts/spec-check.mjs");
const example = resolve(dirname(fileURLToPath(import.meta.url)), "../../../example");

function fixture(id = "spec:2026/07/22/example") {
  const root = mkdtempSync(join(tmpdir(), "spec-check-"));
  const specDirectory = join(root, ".specs", "2026", "07", "22", "example");
  mkdirSync(specDirectory, { recursive: true });
  writeFileSync(
    join(specDirectory, "spec.md"),
    `---\nid: "${id}"\n---\n\n# Example\n\n## Requirements\n\n### works\n\nIt works.\n`,
  );
  writeFileSync(join(root, "example.test.js"), "// spec:2026/07/22/example#works\n");
  return root;
}

test("accepts a valid Specea project", () => {
  const root = fixture();
  try {
    const result = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /ok \(1 specs checked\)/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validates the checked-in example project", () => {
  const result = spawnSync(process.execPath, [validator, example], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /ok \(3 specs checked\)/);
});

test("rejects a frontmatter ID that differs from the path", () => {
  const root = fixture("spec:2026/07/22/wrong");
  try {
    const result = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /frontmatter id must be/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
