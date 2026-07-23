import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const validator = resolve(dirname(fileURLToPath(import.meta.url)), "../scripts/spec-check.mjs");
const example = resolve(dirname(fileURLToPath(import.meta.url)), "../../../example");

function fixture(id = "spec:2026/07/22/example", organization = ["2026", "07", "22", "example"]) {
  const root = mkdtempSync(join(tmpdir(), "spec-check-"));
  const specDirectory = join(root, ".specea", "specs", ...organization);
  mkdirSync(specDirectory, { recursive: true });
  writeFileSync(
    join(specDirectory, "spec.md"),
    `---\nid: "${id}"\n---\n\n# Example\n\n## Requirements\n\n### works\n\nIt works.\n`,
  );
  writeFileSync(join(root, "example.test.js"), `// ${id}#works\n`);
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

test("accepts free organization under the specs directory", () => {
  const root = fixture(
    "spec:Feature Groups/OAuth_v2/example",
    ["Feature Groups", "OAuth_v2", "example"],
  );
  try {
    const result = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("does not accept a stale spaced ID as a shorter existing ID", () => {
  const root = fixture("spec:Feature", ["Feature"]);
  try {
    writeFileSync(join(root, "example.test.js"), "// spec:Feature Groups/missing#works\n");
    const result = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /unresolved or ambiguous spec reference/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("requires a containing directory for spec.md", () => {
  const root = fixture("spec:2026/07/22/example", []);
  try {
    const result = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /spec\.md must be inside its own directory/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects an ID that does not match its directory path", () => {
  const root = fixture("not-a-spec-id");
  try {
    const result = spawnSync(process.execPath, [validator, root], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /frontmatter id must be/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
