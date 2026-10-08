#!/usr/bin/env node
// Copies package.json's version into both plugin manifests.
// Runs after changeset version. Check mode reports all mismatches without writes.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPaths = [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"];
const errors = [];

function readVersion(path) {
  try {
    const source = readFileSync(join(repo, path), "utf8");
    const parsed = JSON.parse(source);
    if (typeof parsed?.version !== "string" || !parsed.version.trim()) {
      throw new Error("missing or invalid version field");
    }
    return { path, source, version: parsed.version };
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
  }
}

// Locate the root property, even when an unrelated nested version precedes it.
function replaceVersion(source, version) {
  const tokens = [...source.matchAll(/"(?:\\.|[^"\\])*"|[{}\[\]:,]|[^\s{}\[\]:,]+/g)];
  let depth = 0;
  let value;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i][0];
    if (depth === 1 && token.startsWith('"') && JSON.parse(token) === "version" && tokens[i + 1]?.[0] === ":") {
      value = tokens[i + 2];
    }
    if (token === "{" || token === "[") depth++;
    if (token === "}" || token === "]") depth--;
  }
  if (!value) throw new Error("could not locate root version field");
  return source.slice(0, value.index) + JSON.stringify(version) + source.slice(value.index + value[0].length);
}

const pkg = readVersion("package.json");
const manifests = manifestPaths.map(readVersion);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const stale = manifests.filter(manifest => manifest.version !== pkg.version);
if (process.argv.includes("--check") && stale.length) {
  for (const manifest of stale) {
    console.error(`${manifest.path}: version is ${manifest.version}, package.json is ${pkg.version}. Run \`node scripts/sync-plugin-version.mjs\`.`);
  }
  process.exit(1);
}

for (const manifest of stale) {
  writeFileSync(join(repo, manifest.path), replaceVersion(manifest.source, pkg.version));
  console.log(`${manifest.path}: version ${manifest.version} -> ${pkg.version}`);
}
if (!stale.length) console.log(`Both plugin manifests are in sync at ${pkg.version}.`);
