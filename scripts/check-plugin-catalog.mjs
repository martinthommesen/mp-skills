#!/usr/bin/env node
// Verifies curated membership and native package references without writing.

import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repo = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const errors = [];
const fail = (path, message) => errors.push(`${path}: ${message}`);
const contained = path => path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);

function readJson(path) {
  try {
    return JSON.parse(readFileSync(join(repo, path), "utf8"));
  } catch (error) {
    fail(path, error.message);
  }
}

function localPath(value, label) {
  if (typeof value !== "string" || !value.startsWith("./")) {
    fail(label, `expected a ./ relative path, received ${JSON.stringify(value)}`);
    return;
  }
  const path = relative(repo, resolve(repo, value));
  if (!contained(path)) {
    fail(label, `path escapes repository root: ${value}`);
    return;
  }
  if (existsSync(join(repo, path)) && !contained(relative(repo, realpathSync(join(repo, path))))) {
    fail(label, `path escapes repository root through a symlink: ${value}`);
    return;
  }
  return path.split(sep).join("/");
}

function requireFile(value, label) {
  const path = localPath(value, label);
  if (path === undefined) return;
  try {
    if (!statSync(join(repo, path)).isFile()) throw new Error("expected a file");
  } catch (error) {
    fail(label, `${value}: ${error.message}`);
  }
  return path;
}

const promoted = new Set();
for (const bucket of ["engineering", "productivity"]) {
  const path = `skills/${bucket}`;
  try {
    for (const entry of readdirSync(join(repo, path), { withFileTypes: true })) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
      const skill = `${path}/${entry.name}`;
      promoted.add(skill);
      requireFile(`./${skill}/SKILL.md`, skill);
    }
  } catch (error) {
    fail(path, error.message);
  }
}

function checkSkills(manifest, path) {
  const declared = new Set();
  if (!Array.isArray(manifest?.skills)) {
    fail(path, "skills must be an explicit array of curated paths");
    return declared;
  }
  for (const value of manifest.skills) {
    const skill = localPath(value, `${path} skills`);
    if (skill === undefined) continue;
    if (declared.has(skill)) fail(path, `duplicate skill path: ${value}`);
    declared.add(skill);
    if (!promoted.has(skill)) fail(path, `unpromoted skill path: ${value}`);
    requireFile(`./${skill}/SKILL.md`, `${path} skills`);
  }
  for (const skill of promoted) {
    if (!declared.has(skill)) fail(path, `omitted promoted skill: ./${skill}`);
  }
  return declared;
}

const claudePath = ".claude-plugin/plugin.json";
const codexPath = ".codex-plugin/plugin.json";
const marketplacePath = ".agents/plugins/marketplace.json";
const claude = readJson(claudePath);
const codex = readJson(codexPath);
const marketplace = readJson(marketplacePath);
checkSkills(claude, claudePath);
const nativeSkills = checkSkills(codex, codexPath);

for (const field of ["composerIcon", "logo"]) {
  requireFile(codex?.interface?.[field], `${codexPath} interface.${field}`);
}
const onboardingLabel = `${codexPath} extensions.com.openai.onboardingSkill`;
const onboarding = requireFile(codex?.extensions?.["com.openai"]?.onboardingSkill, onboardingLabel);
if (onboarding !== undefined && (!onboarding.endsWith("/SKILL.md") || !nativeSkills.has(onboarding.slice(0, -"/SKILL.md".length)))) {
  fail(onboardingLabel, "must reference SKILL.md of a declared promoted skill");
}

if (!Array.isArray(marketplace?.plugins) || marketplace.plugins.length !== 1) {
  fail(marketplacePath, "plugins must contain exactly one native plugin");
} else {
  const plugin = marketplace.plugins[0];
  if (!codex?.name || plugin?.name !== codex.name) fail(marketplacePath, "plugin name must match the native manifest name");
  const sourcePath = localPath(plugin?.source?.path, `${marketplacePath} source.path`);
  if (plugin?.source?.source !== "local" || sourcePath !== "") fail(marketplacePath, "source must be local and resolve to the repository root");
  if (plugin?.policy?.installation !== "AVAILABLE" || plugin?.policy?.authentication !== "ON_INSTALL") {
    fail(marketplacePath, "policy must use AVAILABLE installation and ON_INSTALL authentication");
  }
  if (plugin?.category !== "Developer Tools") fail(marketplacePath, "category must be Developer Tools");
}

if (existsSync(join(repo, "plugin.json"))) {
  const portable = readJson("plugin.json");
  if (typeof portable?.name === "string" || (typeof portable?.$schema === "string" && portable.$schema.includes("agent-plugins.org"))) {
    fail("plugin.json", "portable root manifest masks curated native skill discovery; remove it");
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Plugin catalogs match ${promoted.size} promoted skills; native references are valid.`);
