import assert from "node:assert/strict";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifests = [".claude-plugin/plugin.json", ".codex-plugin/plugin.json"];
const promoted = ["./skills/engineering/ask-matt", "./skills/productivity/teach"];

function fixture(t, options = {}) {
  const root = mkdtempSync(join(tmpdir(), "plugin-packaging-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, value) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n");
  };
  put("package.json", { version: options.packageVersion ?? "9.2.0" });
  put(manifests[0], { name: "mattpocock-skills", version: options.claudeVersion ?? "9.2.0", skills: options.claudeSkills ?? promoted });
  put(manifests[1], {
    name: "mattpocock-skills", version: options.codexVersion ?? "9.2.0", skills: options.codexSkills ?? promoted,
    interface: { composerIcon: "./assets/plugin-icon.svg", logo: "./assets/plugin-icon.svg" },
    extensions: { "com.openai": { onboardingSkill: "./skills/engineering/ask-matt/SKILL.md" } },
  });
  put(".agents/plugins/marketplace.json", {
    name: "mattpocock", plugins: [{ name: "mattpocock-skills", source: { source: "local", path: "./" },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" }, category: "Developer Tools" }],
  });
  for (const path of [...promoted, "./skills/in-progress/beta", "./skills/misc/old"]) put(`${path}/SKILL.md`, "# Synthetic skill\n");
  put("assets/plugin-icon.svg", '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"/>\n');
  mkdirSync(join(root, "scripts"));
  for (const script of ["sync-plugin-version.mjs", "check-plugin-catalog.mjs"]) {
    if (existsSync(join(repo, "scripts", script))) copyFileSync(join(repo, "scripts", script), join(root, "scripts", script));
  }
  return { root, put, read: path => readFileSync(join(root, path)) };
}

function run(f, script, args = [], cwd = f.root) {
  return spawnSync(process.execPath, [join(f.root, "scripts", script), ...args], { cwd, encoding: "utf8" });
}

// Removing either check branch would silently allow a stale release manifest.
for (const [name, claudeVersion, codexVersion, status] of [
  ["both matching", "9.2.0", "9.2.0", 0],
  ["only Claude stale", "1.0.0", "9.2.0", 1],
  ["only Codex stale", "9.2.0", "1.0.0", 1],
  ["both stale", "1.0.0", "2.0.0", 1],
]) {
  test(`sync check: ${name}, without writes`, t => {
    const f = fixture(t, { claudeVersion, codexVersion });
    const before = manifests.map(f.read);
    const result = run(f, "sync-plugin-version.mjs", ["--check"]);
    assert.equal(result.status, status, result.stderr);
    if (claudeVersion !== "9.2.0") assert.match(result.stderr, /\.claude-plugin\/plugin\.json/);
    if (codexVersion !== "9.2.0") assert.match(result.stderr, /\.codex-plugin\/plugin\.json/);
    assert.deepEqual(manifests.map(f.read), before);
  });
}

// Re-serializing or skipping a manifest would alter bytes outside the version.
test("sync updates both, preserves formatting and fields, and is idempotent", t => {
  const f = fixture(t);
  const source = '{\n\t"nested": {"version": "keep"},\n\t"version" : "1.0.0",\n\t"name": "kept", "extra": [1, 2]\n}\n';
  for (const path of manifests) f.put(path, source);
  const expected = source.replace('"version" : "1.0.0"', '"version" : "9.2.0"');
  const result = run(f, "sync-plugin-version.mjs", [], tmpdir());
  assert.equal(result.status, 0, result.stderr);
  for (const path of manifests) {
    assert.equal(JSON.parse(f.read(path)).version, "9.2.0");
    assert.equal(f.read(path).toString(), expected);
  }
  assert.equal(run(f, "sync-plugin-version.mjs").status, 0);
  for (const path of manifests) assert.equal(f.read(path).toString(), expected);
});

// Malformed input must fail before any manifest is written.
for (const path of ["package.json", ...manifests]) {
  for (const kind of ["missing file", "missing version", "invalid JSON"]) {
    test(`sync rejects ${path}: ${kind}`, t => {
      const f = fixture(t, { claudeVersion: "1.0.0", codexVersion: "1.0.0" });
      if (kind === "missing file") rmSync(join(f.root, path));
      else f.put(path, kind === "invalid JSON" ? "{broken" : { name: "test" });
      const before = manifests.filter(p => existsSync(join(f.root, p))).map(f.read);
      const result = run(f, "sync-plugin-version.mjs");
      assert.equal(result.status, 1);
      assert.ok(result.stderr.includes(path), result.stderr);
      assert.match(result.stderr, kind === "missing version" ? /version/ : kind === "invalid JSON" ? /JSON/ : /ENOENT|missing|read/i);
      assert.deepEqual(manifests.filter(p => existsSync(join(f.root, p))).map(f.read), before);
    });
  }
}

// CWD-based resolution or hardcoded membership would reject this small catalog.
test("catalog matches promoted set and resolves from unrelated cwd", t => {
  const f = fixture(t, { codexSkills: ["./skills/productivity/teach/", "./skills/engineering/../engineering/ask-matt"] });
  const before = manifests.map(f.read);
  const result = run(f, "check-plugin-catalog.mjs", [], tmpdir());
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /2 promoted skills/);
  assert.deepEqual(JSON.parse(f.read(manifests[0])).skills.sort(), ["./skills/engineering/ask-matt", "./skills/productivity/teach"]);
  assert.deepEqual(manifests.map(f.read), before);
});

const catalogCases = [
  ["omitted promoted skill", f => { const p = JSON.parse(f.read(manifests[1])); p.skills.pop(); f.put(manifests[1], p); }, /\.codex-plugin\/plugin\.json.*skills\/productivity\/teach/],
  ["Claude omission", f => { const p = JSON.parse(f.read(manifests[0])); p.skills.pop(); f.put(manifests[0], p); }, /\.claude-plugin\/plugin\.json.*skills\/productivity\/teach/],
  ...["in-progress/beta", "misc/old"].map(path => [
    `unpromoted ${path}`, f => { const p = JSON.parse(f.read(manifests[1])); p.skills.push(`./skills/${path}`); f.put(manifests[1], p); }, new RegExp(`unpromoted.*skills/${path}`),
  ]),
  ["duplicate normalized paths", f => { const p = JSON.parse(f.read(manifests[1])); p.skills.push("./skills/engineering/ask-matt/"); f.put(manifests[1], p); }, /duplicate.*ask-matt/],
  ["missing SKILL.md", f => rmSync(join(f.root, "skills/productivity/teach/SKILL.md")), /skills\/productivity\/teach\/SKILL\.md/],
  ["escaping skill path", f => { const p = JSON.parse(f.read(manifests[1])); p.skills.push("./../outside"); f.put(manifests[1], p); }, /escape.*outside/],
  ["absolute skill path", f => { const p = JSON.parse(f.read(manifests[1])); p.skills.push("/tmp/outside"); f.put(manifests[1], p); }, /relative.*outside/],
  ["missing icon", f => rmSync(join(f.root, "assets/plugin-icon.svg")), /assets\/plugin-icon\.svg/],
  ["missing onboarding file", f => { const p = JSON.parse(f.read(manifests[1])); p.extensions["com.openai"].onboardingSkill = "./skills/engineering/ask-matt/absent.md"; f.put(manifests[1], p); }, /ask-matt\/absent\.md/],
  ["unpromoted onboarding skill", f => { const p = JSON.parse(f.read(manifests[1])); p.extensions["com.openai"].onboardingSkill = "./skills/in-progress/beta/SKILL.md"; f.put(manifests[1], p); }, /onboardingSkill.*declared|onboardingSkill.*promoted/],
  ["portable manifest masking curation", f => f.put("plugin.json", { $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json", name: "portable" }), /plugin\.json.*portable/],
  ["wrong native source root", f => { const p = JSON.parse(f.read(".agents/plugins/marketplace.json")); p.plugins[0].source.path = "./skills"; f.put(".agents/plugins/marketplace.json", p); }, /marketplace\.json.*source/],
  ["wrong native source type", f => { const p = JSON.parse(f.read(".agents/plugins/marketplace.json")); p.plugins[0].source.source = "git"; f.put(".agents/plugins/marketplace.json", p); }, /marketplace\.json.*source/],
  ["wrong marketplace identity", f => { const p = JSON.parse(f.read(".agents/plugins/marketplace.json")); p.plugins[0].name = "different"; f.put(".agents/plugins/marketplace.json", p); }, /marketplace\.json.*name/],
  ["wrong native policy", f => { const p = JSON.parse(f.read(".agents/plugins/marketplace.json")); p.plugins[0].policy.authentication = "NEVER"; f.put(".agents/plugins/marketplace.json", p); }, /marketplace\.json.*policy/],
  ["broad skill discovery", f => { const p = JSON.parse(f.read(manifests[1])); p.skills = "./skills/"; f.put(manifests[1], p); }, /\.codex-plugin\/plugin\.json.*skills.*array/],
];
// Omitting any named validation allows an invalid package to pass a release guard.
for (const [name, mutate, cause] of catalogCases) {
  test(`catalog rejects ${name} without writes`, t => {
    const f = fixture(t);
    mutate(f);
    const before = manifests.map(f.read);
    const result = run(f, "check-plugin-catalog.mjs");
    assert.equal(result.status, 1);
    assert.match(result.stderr, cause);
    assert.deepEqual(manifests.map(f.read), before);
  });
}
for (const path of [...manifests, ".agents/plugins/marketplace.json"]) {
  for (const kind of ["missing manifest", "invalid JSON"]) {
    test(`catalog rejects ${path}: ${kind}`, t => {
      const f = fixture(t);
      if (kind === "missing manifest") rmSync(join(f.root, path));
      else f.put(path, "{broken");
      const result = run(f, "check-plugin-catalog.mjs");
      assert.equal(result.status, 1);
      assert.ok(result.stderr.includes(path), result.stderr);
    });
  }
}
