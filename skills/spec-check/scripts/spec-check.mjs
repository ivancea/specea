#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(process.argv[2] ?? process.cwd());
const ignoredDirectories = new Set([".git", ".agents", "apm_modules", "node_modules"]);
const files = [];
const errors = [];
const specs = new Map();
const specsRoot = resolve(root, ".specea", "specs");
const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  if (directory === skillRoot) return;
  if (directory !== root && existsSync(resolve(directory, ".specea", "specs"))) return;

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

function parseSpec(file) {
  const specPath = relative(specsRoot, file);
  if (specPath.startsWith(`..${sep}`) || specPath === "..") return;

  const specSegments = specPath.split(sep);
  if (specSegments.at(-1) !== "spec.md") return;

  if (specSegments.length < 2) {
    addError(file, "spec.md must be inside its own directory under .specea/specs");
    return;
  }

  const expectedId = `spec:${specSegments.slice(0, -1).join("/")}`;

  const content = readFileSync(file, "utf8");
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const idMatch = frontmatter?.[1].match(/^id:\s*(?:"([^"]+)"|'([^']+)'|(\S+))\s*$/m);
  const declaredId = idMatch?.[1] ?? idMatch?.[2] ?? idMatch?.[3];

  if (!frontmatter) addError(file, "missing YAML frontmatter");
  else if (!declaredId) addError(file, "frontmatter must contain an id");
  else if (declaredId !== expectedId) {
    addError(file, `frontmatter id must be ${JSON.stringify(expectedId)}`);
  }

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
  specs.set(expectedId, { directory: dirname(file), file, requirements });
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

  const handledRanges = [];
  const sortedSpecs = [...specs.entries()].sort(([left], [right]) => right.length - left.length);

  for (const [id, spec] of sortedSpecs) {
    let fromIndex = 0;
    while (fromIndex < content.length) {
      const index = content.indexOf(id, fromIndex);
      if (index < 0) break;
      fromIndex = index + id.length;
      if (handledRanges.some(([start, end]) => index >= start && index < end)) continue;

      let end = index + id.length;
      const following = content[end];
      if (following && /[A-Za-z0-9_-]/.test(following)) continue;
      if (following && /\s/.test(following)) {
        const restOfLine = content.slice(end).match(/^[^\r\n]*/)?.[0].trim();
        if (restOfLine) continue;
      }

      let requirement;
      let artifact;
      if (following === "#") {
        const match = content.slice(end + 1).match(/^([a-z0-9]+(?:-[a-z0-9]+)*)/);
        if (!match) {
          addError(file, `invalid spec reference ${JSON.stringify(`${id}#`)}`, lineAt(content, index));
          handledRanges.push([index, end + 1]);
          continue;
        }
        requirement = match[1];
        end += requirement.length + 1;
      } else if (following === "/") {
        const match = content.slice(end + 1).match(/^([^\s"'`<>()\[\]{},;]+)/);
        if (match) {
          artifact = match[1].replace(/[.!?:]+$/, "");
          end += artifact.length + 1;
        }
      }

      handledRanges.push([index, end]);
      const reference = content.slice(index, end);
      const line = lineAt(content, index);
      if (requirement && !spec.requirements.has(requirement)) {
        addError(file, `referenced requirement does not exist: ${reference}`, line);
      } else if (artifact) {
        const artifactSegments = artifact.split("/");
        if (
          artifact.includes("\\") ||
          artifactSegments.some((segment) => !segment || segment === "." || segment === "..")
        ) {
          addError(file, `invalid artifact reference ${JSON.stringify(reference)}`, line);
          continue;
        }
        const artifactFile = resolve(spec.directory, artifact);
        const insideSpec = artifactFile.startsWith(`${spec.directory}${sep}`);
        if (!insideSpec || !existsSync(artifactFile)) {
          addError(file, `referenced artifact does not exist: ${reference}`, line);
        }
      }
    }
  }

  const referencePattern = /spec:[^\s"'`<>()\[\]{},;]+/g;
  for (const match of content.matchAll(referencePattern)) {
    if (handledRanges.some(([start, end]) => match.index >= start && match.index < end)) continue;
    if (!/^spec:[A-Za-z0-9_]/.test(match[0])) continue;
    const reference = match[0].replace(/[.!?:]+$/, "");
    addError(file, `unresolved or ambiguous spec reference: ${reference}`, lineAt(content, match.index));
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
