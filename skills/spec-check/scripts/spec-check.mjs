#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? process.cwd());
const ignoredDirectories = new Set([".git", ".agents", "apm_modules", "node_modules"]);
const files = [];
const errors = [];
const specs = new Map();
const specsRoot = resolve(root, ".specs");

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`spec-check: not a directory: ${root}`);
  process.exit(2);
}

function displayPath(file) {
  return relative(root, file).split(sep).join("/") || ".";
}

function addError(file, message, line) {
  errors.push(`${displayPath(file)}${line ? `:${line}` : ""}: ${message}`);
}

function walk(directory) {
  if (directory !== root && existsSync(resolve(directory, ".specs"))) return;

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;

    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) walk(path);
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
}

function validRequirementName(name) {
  if (/^\d+$/.test(name)) return /^[1-9]\d*$/.test(name);
  return /^(?=.*[a-z])[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
}

function validDate(year, month, day) {
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
}

function parseSpec(file) {
  const specPath = relative(specsRoot, file);
  if (specPath.startsWith(`..${sep}`) || specPath === "..") return;

  const specSegments = specPath.split(sep);
  if (
    specSegments.length !== 5 ||
    !/^\d{4}$/.test(specSegments[0]) ||
    !/^\d{2}$/.test(specSegments[1]) ||
    !/^\d{2}$/.test(specSegments[2]) ||
    !validDate(specSegments[0], specSegments[1], specSegments[2]) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(specSegments[3]) ||
    specSegments[4] !== "spec.md"
  ) {
    addError(file, "spec path must be .specs/YYYY/MM/DD/lower-kebab-case/spec.md");
    return;
  }

  const id = `spec:${specSegments.slice(0, 4).join("/")}`;
  const content = readFileSync(file, "utf8");
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const idMatch = frontmatter?.[1].match(/^id:\s*(?:"([^"]+)"|'([^']+)'|(\S+))\s*$/m);
  const declaredId = idMatch?.[1] ?? idMatch?.[2] ?? idMatch?.[3];

  if (!frontmatter) addError(file, "missing YAML frontmatter");
  else if (!declaredId) addError(file, "frontmatter must contain an id");
  else if (declaredId !== id) addError(file, `frontmatter id must be ${JSON.stringify(id)}`);

  const requirements = new Set();
  const lines = content.split(/\r?\n/);
  let inRequirements = false;
  let foundRequirements = false;
  let fence;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0];
      else if (fence === fenceMatch[1][0]) fence = undefined;
      continue;
    }
    if (fence) continue;

    if (line === "## Requirements") {
      if (foundRequirements) addError(file, "duplicate ## Requirements section", index + 1);
      inRequirements = true;
      foundRequirements = true;
      continue;
    }
    if (inRequirements && /^#{1,2}(?:\s|$)/.test(line)) {
      inRequirements = false;
      continue;
    }
    if (!inRequirements || !line.startsWith("### ")) continue;

    const name = line.slice(4);
    if (!validRequirementName(name)) {
      addError(file, `invalid requirement name ${JSON.stringify(name)}`, index + 1);
    } else if (requirements.has(name)) {
      addError(file, `duplicate requirement name ${JSON.stringify(name)}`, index + 1);
    } else {
      requirements.add(name);
    }
  }

  if (!foundRequirements) addError(file, "missing ## Requirements section");
  if (specs.has(id)) addError(file, `duplicate specification id ${id}`);
  else specs.set(id, { directory: dirname(file), file, requirements });
}

function lineAt(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function removeMarkdownExamples(file, content) {
  if (!file.endsWith(".md")) return content;

  const lines = content.split(/\r?\n/);
  let fence;
  return lines
    .map((line) => {
      const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
      if (fenceMatch) {
        if (!fence) fence = fenceMatch[1][0];
        else if (fence === fenceMatch[1][0]) fence = undefined;
        return "";
      }
      if (fence) return "";
      return line.replace(/`[^`\r\n]*`/g, "");
    })
    .join("\n");
}

function checkReferences(file) {
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    return;
  }
  if (content.includes("\0")) return;
  content = removeMarkdownExamples(file, content);

  const referencePattern = /spec:[^\s"'`<>()\[\]{},;]+/g;
  const canonicalPattern = /^spec:(\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+(?:-[a-z0-9]+)*)(?:#([a-z0-9]+(?:-[a-z0-9]+)*)|\/(.+))?$/;

  for (const match of content.matchAll(referencePattern)) {
    let reference = match[0];
    const line = lineAt(content, match.index);
    let parsed = reference.match(canonicalPattern);
    while (!parsed && /[.!?:]$/.test(reference)) {
      reference = reference.slice(0, -1);
      parsed = reference.match(canonicalPattern);
    }
    if (!/^spec:\d{4}\//.test(reference)) continue;
    if (!parsed || (parsed[2] && !validRequirementName(parsed[2]))) {
      addError(file, `invalid spec reference ${JSON.stringify(reference)}`, line);
      continue;
    }

    const id = `spec:${parsed[1]}`;
    const spec = specs.get(id);
    if (!spec) {
      addError(file, `referenced specification does not exist: ${id}`, line);
    } else if (parsed[2] && !spec.requirements.has(parsed[2])) {
      addError(file, `referenced requirement does not exist: ${reference}`, line);
    } else if (parsed[3]) {
      const artifactSegments = parsed[3].split("/");
      if (
        parsed[3].includes("\\") ||
        artifactSegments.some((segment) => !segment || segment === "." || segment === "..")
      ) {
        addError(file, `invalid artifact reference ${JSON.stringify(reference)}`, line);
        continue;
      }
      const artifact = resolve(spec.directory, parsed[3]);
      const insideSpec = artifact.startsWith(`${spec.directory}${sep}`);
      if (!insideSpec || !existsSync(artifact)) {
        addError(file, `referenced artifact does not exist: ${reference}`, line);
      }
    }
  }
}

walk(root);
for (const file of files) parseSpec(file);
for (const file of files) checkReferences(file);

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  console.error(`spec-check: ${errors.length} error(s)`);
  process.exit(1);
}

console.log(`spec-check: ok (${specs.size} specs checked)`);
