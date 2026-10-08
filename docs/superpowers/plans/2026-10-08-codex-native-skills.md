# Codex-native Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing skill catalog native to Codex in ChatGPT desktop while preserving practical Claude and standalone compatibility.

**Architecture:** Keep one canonical directory per skill and curate both plugin manifests from the same promoted buckets. Each deployed skill carries its essential capability selection and portable fallback; longer operations stay in references inside the owning directory. Native presentation, worktrees, and continuation supplement the skills' existing methods and artifact contracts.

**Tech Stack:** Markdown skills and docs, YAML skill metadata, JSON manifests, Node.js 22 with built-in `node:test`, existing Changesets, Git, and available Codex desktop tools. No new runtime or test-library dependency is required.

**Spec:** [Approved design](../specs/2026-10-08-codex-native-skills-design.md), committed as `c6b4aa8`.

## Global Constraints

- Keep one canonical instruction set per skill. Preserve skill names, bucket membership, public URLs, existing artifact formats, and useful Claude-specific workflows.
- The 27 engineering and productivity skills remain the promoted plugin set. Beta skills receive relevant improvements without promotion.
- An individually copied skill must contain its operational references and assets. It cannot depend on a repository-root adapter or on every other skill being installed.
- Preserve each skill's invocation classification. User-only skills keep both `disable-model-invocation: true` and `policy.allow_implicit_invocation: false`.
- Native capabilities come from the current host's exposed tools and their schemas.
- Do not add a generic runtime skill, a custom MCP server, or mandatory dependencies on optional desktop features.
- Preserve `scripts/link-skills.sh` as the existing developer-only utility without modification.
- A user-owned chat is created or messaged only when the human explicitly requests that action. Internal decomposition uses collaboration agents.
- A native goal is created only when the user explicitly requests a goal. Set a native token budget only when the user supplied one.
- `loop-me` remains a specifications-only workflow. Describing or suggesting scheduled work does not activate it.
- Frozen misc skills retain their current purpose; verify their compatibility and package exclusion without rewriting their workflows.
- Synchronize promoted behavior docs and router relationships; beta and misc receive no published docs pages. Keep all prose free of em dashes.
- Preserve the current branch's existing work. At execution time, use `using-git-worktrees` if isolation is needed, then follow the chosen execution skill and `writing-skills` for skill edits.
- Validation must not change the user's normal installation or account. Do not repurpose `HOME`, `home`, or `CODEX_HOME` for isolation. Use a supported isolated configuration, disposable environment, or test account; record unavailable runtime checks as pending.

## Review Focus

- Existing independent instruction files and symlinked files: preserve content, links, and discoverability on a second setup run (Task 3).
- Marketplace loading from an unrelated working directory: resolve both path layers correctly and discover one curated plugin when both catalogs exist (Tasks 1 and 8).
- Partially staged or cancelled WIP edits, deleted lines, and changed anchors: both review axes see the same complete capture; unsupported inline locations receive precise prose (Task 5).
- Dirty, shared, or protected worktrees and failed registration: reuse and cleanup respect ownership, preserve required ignored files, and recover only the intended attachment (Task 4).
- Resume with existing work, goals, or schedules: reconcile before dispatch; do not duplicate agents, infer budgets, activate suggestions, or notify repeatedly on unchanged monitor state (Task 7).

## File and task map

| Task | Responsibility | Dependencies |
| --- | --- | --- |
| 1 | Native package, icons, version/catalog release guards | None |
| 2 | Portable composition, invocation metadata, behavior-probe registry | None |
| 3 | Loaded instruction entrypoints and compatible setup | 2 |
| 4 | Implementation/research worktrees and tracker claims | 2, 3 |
| 5 | Stable review capture, retro provenance, interactive terminals | 2 |
| 6 | Native artifact delivery and preserved editing/rendering contracts | 2 |
| 7 | Portable handoff, durable orchestration, requested continuation | 2 |
| 8 | Distribution smoke check, final router/install/release documentation | 1, 3-7 |
| 9 | Catalog-wide verification and completion evidence | 8 |

The five proposed references are local to their owners: `implement-spec/WORKTREES.md`, `wayfinder/RESEARCH-WORKTREES.md`, `code-review/REVIEW-SURFACES.md`, `setup-matt-pocock-skills/INSTRUCTION-FILES.md`, and `chief-of-staff/STATE-FORMAT.md`. Do not create another shared runtime layer.

Behavior probes are reusable instructions, not prose-matching unit tests. Record baseline and after-change observations in a task-owned temporary/artifact directory. Keep raw logs out of the shipped plugin and committed docs. A staged native call is evidence of routing only, not evidence of a real host side effect.

### Task 1: Curated native package and release guards

**Files:** Create `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, `assets/plugin-icon.svg`, `scripts/check-plugin-catalog.mjs`, and `scripts/plugin-packaging.test.mjs`. Modify `scripts/sync-plugin-version.mjs`, `package.json`, and `.github/workflows/release.yml`. Keep the Claude manifests' identity and membership intact.

**Interfaces:** Existing CLI `node scripts/sync-plugin-version.mjs [--check]` stays stable. New CLI `node scripts/check-plugin-catalog.mjs` resolves the repository from its script location, exits 0 for valid curation or 1 with path-specific errors, and never writes. New npm commands: `test:plugin` runs `node --test scripts/plugin-packaging.test.mjs`; `check-plugin-catalog` runs the new checker. The existing `version` and `check-plugin-version` commands remain.

- [ ] **Step 1: Write black-box failing tests.** In `plugin-packaging.test.mjs`, copy the scripts under test into `mkdtemp` repositories and spawn them with `process.execPath`; register fixture cleanup. Test-local helpers are `fixture(t, options) -> {root, read(path): Buffer}`, `run(fixture, script, args = [], cwd = fixture.root) -> {status, stdout, stderr}`. Options specify package/manifest versions and declared skill paths. Pin these assertions:

```javascript
// sync_check_reports_both_mismatches_without_writes
assert.equal(result.status, 1);
assert.match(result.stderr, /\.claude-plugin\/plugin\.json/);
assert.match(result.stderr, /\.codex-plugin\/plugin\.json/);
assert.deepEqual(afterBytes, beforeBytes);
// sync_updates_both_and_preserves_unrelated_fields_and_formatting
assert.equal(claude.version, "9.2.0");
assert.equal(codex.version, "9.2.0");
assert.equal(actualSource, expectedVersionLineOnlyRewrite);
// catalog_matches_promoted_set_and_resolves_from_unrelated_cwd
assert.equal(result.status, 0);
assert.deepEqual(actualDeclaredPaths.sort(), expectedPromotedPaths.sort());
```

Also test both matching versions, only Claude stale, only Codex stale, and an idempotent second synchronization. Check mode must never change either file. Test a missing manifest/version field, invalid JSON, an omitted promoted skill, a beta/misc inclusion, duplicate paths, missing `SKILL.md`, paths escaping the root, a missing icon/onboarding file, and a portable root manifest masking curation. Each invalid fixture must exit 1 and name the cause. Tests use small synthetic catalogs; the real checker discovers the promoted set rather than hardcoding 27 forever.

- [ ] **Step 2: Observe the intended failures.** Run `node --test scripts/plugin-packaging.test.mjs`. Confirm failures expose absent native synchronization/checking rather than a broken fixture.
- [ ] **Step 3: Implement manifests and icon.** Native identity is `mattpocock-skills`, initial version `1.3.1`, with the same 27 explicit paths as Claude. Use root `interface`, not the portable format's interface namespace: `displayName: "Matt Pocock Skills"`, `shortDescription: "Skills for real engineering"`, `developerName: "mp-skills"`, `category: "Developer Tools"`, a long description identifying this Codex-first fork, `capabilities: ["Interactive"]`, and both icon paths `./assets/plugin-icon.svg`. Create an original square 64-by-64 SVG with neutral code-bracket geometry and no external assets. Preserve the existing author attribution; set the native repository URL to `https://github.com/martinthommesen/mp-skills`. Set `extensions["com.openai"].onboardingSkill` to `./skills/engineering/ask-matt/SKILL.md`. Omit portable root manifest, MCP/apps/hooks, and invented listing URLs. The native catalog uses name `mattpocock`, one plugin with `source: {source: "local", path: "./"}`, `policy: {installation: "AVAILABLE", authentication: "ON_INSTALL"}`, and category `Developer Tools`. These formats follow the [manifest reference](https://developers.openai.com/plugins/deploy/submission) and [marketplace rules](https://developers.openai.com/plugins/build/plugins).
- [ ] **Step 4: Implement guards and CI integration.** Synchronize both manifests, reporting every mismatch in check mode without writes. Preserve formatting and key order. The catalog checker compares normalized contained skill paths against the actual engineering/productivity directories, checks required referenced files, validates the native source/onboarding relationship, and rejects a recognized portable root manifest. Add npm commands and run them after `npm ci` and before the Changesets action in release CI.
- [ ] **Step 5: Verify and commit.** Run `npm run test:plugin`, `npm run check-plugin-version`, and `npm run check-plugin-catalog`; expect all pass and exactly 27 real promoted skills. Inspect the SVG and unchanged Claude set. Run `claude plugin validate . --strict` with an available CLI; the current machine lacks it, so record that limitation if no disposable validator is available. Commit as `feat: package curated skills for Codex`.

### Task 2: Portable composition and skill-picker metadata

**Files:** Modify `.agents/invocation.md`, `.out-of-scope/native-question-tool.md`, and `skills/productivity/writing-for-agents/SKILL-MECHANICS.md`. Replace operative literal-tool assumptions in these `SKILL.md` files: engineering `tdd`, `implement`, `implement-spec`, `triage`, `wayfinder`, `retro`, `grill-with-docs`, `improve-codebase-architecture`; productivity `grill-me`, `handoff`; in-progress `claude-handoff`, `loop-me`, `setup-ts-deep-modules`. Modify the existing `agents/openai.yaml` for the 23 explicit-only entrypoints, identified by current paired policies. Create `docs/superpowers/validation/codex-native-skill-scenarios.md`. Sync composition-related promoted docs where their stated behavior changes; later tasks own their additional workflow docs.

**Interfaces:** Short inline composition contract: eligible host skill mechanism, installed-catalog file-read fallback, user-only boundary, missing-prerequisite response. Operational references resolve within each copied skill directory. Scenario registry records ID, fixture/input, baseline observation, expected behavior, and evidence level; later tasks append their probes. No new runtime API.

- [ ] **Step 1: Establish baseline composition probes.** Copy `grill-me` without `grilling`, then with `grilling`, into separate fixture installations. Give a fresh evaluator no Skill tool. Observe missing prerequisite versus actual loading, and attempt to invoke a user-only prerequisite implicitly. Add a standalone copied `SKILL-MECHANICS.md` authoring probe. Expected behavior is explicit prerequisite reporting, successful eligible file loading, and preservation of human-only reach.
- [ ] **Step 2: Update the loading contract and metadata.** Keep essential instructions inside every affected skill; sequential dependencies remain sequential. Reconcile maintainer and installed-reference guidance, including the incorrect claim that shared reference can require an external root file. Mark the old native-question rejection superseded by current eligible-tool policy. Add useful single-string `interface.default_prompt` values containing `$<skill-name>` to all 23 user-only entrypoints; preserve policies, names, display metadata, and model-facing descriptions. Do not add dependencies or blanket product restrictions.
- [ ] **Step 3: Re-run probes and inspect the full catalog.** Verify copied resources work, required answers remain pending, optional unanswered preferences follow the actual question schema, and learning questions suggest no correct answer. Check all 38 frontmatter/YAML pairs using a real YAML parser or the available evaluator, not newly invented prose regexes. Resolve intentional static warnings separately from parse/resource failures. Preserve all four frozen workflows. Commit as `feat: make skill composition portable across Codex and Claude`.

### Task 3: Instructions both hosts actually load

**Files:** Modify `skills/engineering/setup-matt-pocock-skills/SKILL.md`, create its `INSTRUCTION-FILES.md`, modify `skills/in-progress/setup-ts-deep-modules/SKILL.md`, and sync `docs/engineering/setup-matt-pocock-skills.md`. Retain all six setup seed files; Task 4 owns tracker claim additions.

**Interfaces:** `docs/agents/{issue-tracker,domain,triage-labels}.md` remain canonical configuration. Setup returns proposed entrypoint changes for review, then edits the chosen approved files. The beta TS skill adds its packages pointer through a loaded entrypoint without changing its boundary-rule verification.

- [ ] **Step 1: Run the baseline setup matrix.** Prepare local-tracker repositories for neither entrypoint, AGENTS-only, CLAUDE-only, independent files, and existing symlink. Put unrelated sentinel prose around existing blocks. With test-provided answers, check both hosts' discovered pointers, compare bytes after a second run, and check `readlink`; the current Claude-only rule should expose the Codex discovery gap.
- [ ] **Step 2: Implement the five-case decision table.** New repos use AGENTS plus a minimal Claude bridge. Existing Claude-only repos gain a Codex bridge; AGENTS-only repos preserve their content and gain the needed Claude pointer. Independent files retain their surroundings and explicit pointers; symlinks stay intact. Avoid duplicate configuration and global fallback changes. Present temporary draft files in native panels before setup's existing required review. Mirror the entrypoint logic in TS setup's final pointer step.
- [ ] **Step 3: Verify and sync docs.** Repeat all five cases and idempotence checks, including a symlink from CLAUDE to AGENTS and the reverse. Confirm `triage` absent still omits label setup, tracker selection remains intact, and draft opening does not count as approval. Replace the stale docs FAQ describing an unfixed Codex gap. Commit as `fix: make repository skill instructions discoverable in Codex`.

### Task 4: Owned execution and research worktrees

**Files:** Modify engineering `implement-spec/SKILL.md`, `wayfinder/SKILL.md`, `research/SKILL.md`; create `implement-spec/WORKTREES.md` and `wayfinder/RESEARCH-WORKTREES.md`. Add implementation-claim sections to setup's four `issue-tracker-*.md` seeds. Sync `docs/engineering/{implement-spec,wayfinder,research,setup-matt-pocock-skills}.md`.

**Interfaces:** Implementation dispatch carries ticket/spec/tracker pointers, claim owner, integration SHA, intended branch, returned workspace, attachment identity, and cleanup ownership. Wayfinder dispatch carries question/tracker pointers, claim owner, research starting SHA and branch. Completion includes implementation commit evidence or Wayfinder's pushed research branch plus context pointer. Local implementation uses `Claimed by:` separately from triage `Status:`; remote trackers use documented assignees. Track locally landed tickets when PR closure is deferred.

- [ ] **Step 1: Probe existing lifecycle failures.** In a disposable Git repository with a local bare remote, create two independent implementation tickets, one blocked ticket, unrelated dirty work, and an ignored required fixture. Separately dispatch two Wayfinder research tickets from one selected revision, then advance the default branch. Record baseline SHA, ownership, frontier, claim-state, and research-retention failures.
- [ ] **Step 2: Implement managed-first lifecycle instructions.** Inspect/reuse suitable owned attachments; create from the recorded immutable SHA, wait/repair registration, enter the returned directory, and establish the ticket branch. Respect actual agent capacity and queue excess without recursion guards. Replace destructive reset guidance with ownership-aware verification or recreation. Serialize integration merges and recompute the frontier from landed work. Attach created draft PRs and preserve conditional PR policy. Archive only disposable implementation worktrees, preserving needed ignored files and protected/shared checkouts. Wayfinder claims before dispatch and retains pushed evidence without a PR or integration merge; standalone research still returns a cited Markdown note.
- [ ] **Step 3: Verify the Git fixture and staged native traces.** Inspect `git worktree list --porcelain`, initial `git rev-parse HEAD`, branch refs, `git merge-base --is-ancestor <landed-sha> <integration>`, tracker claims, and unchanged unrelated `git status --porcelain=v1`. Verify research refs using `git --git-dir=<origin.git> for-each-ref refs/heads/research/`. Reproduce failed registration and protected archival through staged tool responses. Real managed APIs are scoped to the calling chat's repository; only an actually isolated host/chat targeting the fixture can provide live native evidence. CLI removal does not prove archival.
- [ ] **Step 4: Sync docs and commit.** Describe capacity and merge behavior accurately, qualify fast-forward promises, and distinguish Wayfinder from standalone research. Confirm implementation claims preserve triage roles. Commit as `feat: use owned Codex worktrees for implementation and research`.

### Task 5: Review evidence, chat provenance, and visible terminals

**Files:** Modify engineering `code-review/SKILL.md`, `pr/SKILL.md`, `retro/SKILL.md`, `diagnosing-bugs/SKILL.md`, `diagnosing-bugs/scripts/hitl-loop.template.sh` comments, and `wizard/SKILL.md`; create `code-review/REVIEW-SURFACES.md`. Sync corresponding `docs/engineering/{code-review,pr,retro,diagnosing-bugs,wizard}.md`. Preserve wizard's template library.

**Interfaces:** Both review axes consume one captured bundle containing scope, resolved revisions, diff files, required index/worktree snapshots, untracked content, spec pointer, and standards pointers. Native panels supplement that bundle. Retro consumes current context or explicitly selected native chat/log evidence and produces proposals. Terminal handover names the saved script and verified visible terminal, or a command for the user's terminal.

- [ ] **Step 1: Establish baseline review/terminal/provenance probes.** Include staged-only, unstaged-only, partially staged, ignored, deleted, missing-spec, changed-anchor, and untracked filename-with-spaces cases. Include a staged edit cancelled in the working file: `git diff HEAD` is empty even though both diffs exist. Stage selected-chat results with pagination and truncated summaries; stage a hidden PTY without a visible terminal.
- [ ] **Step 2: Implement capture and matching presentation.** Preserve branch merge-base semantics while pinning SHAs. For generic WIP, capture `git diff --cached --binary --no-ext-diff`, `git diff --binary --no-ext-diff`, `git ls-files --others --exclude-standard -z`, and relevant contents once. Give both axes the captured files instead of letting them rerun mutable commands. Open matching PR/branch/staged/unstaged panels when supported; combined WIP remains explicit even if no single panel represents it. Verify anchors before inline findings and use prose for deleted/unsupported/stale locations. Attach only created or actually worked PRs; body writing implies no publication.
- [ ] **Step 3: Implement retro and terminal routes.** Prefer current chat; use native list/read/pagination for a selected other chat, preserve returned titles, and label summaries/truncation. Keep narrow raw-log fallback and proposal-only output. Require a visible interactive terminal before human-input execution; otherwise return the saved command. Preserve the red-capable diagnosis gate and redaction, and wizard's rule against agent-running its human wizard end to end.
- [ ] **Step 4: Verify and commit.** Repeat probes; both axes must see identical captured evidence and keep their separate budgets/results. Confirm no chat mutation/messaging calls. Run `bash -n` on both bundled shell templates and a harmless copied diagnosis script in a verified visible terminal when available. Rewrite the stale WIP and redaction FAQs. Commit as `feat: integrate native review and interactive debugging surfaces`.

### Task 6: Useful artifact presentation with preserved output contracts

**Files:** Modify engineering `prototype/{SKILL,LOGIC,UI}.md`, `domain-modeling/SKILL.md`, `grill-with-docs/SKILL.md`, `to-spec/SKILL.md`, `to-tickets/SKILL.md`, and `improve-codebase-architecture/{SKILL,REPORT}.md` only where supplemental artifact guidance is needed. Modify productivity `teach/SKILL.md`, `to-questionnaire/SKILL.md`, `writing-for-agents/SKILL.md`, and beta `writing-{beats,fragments,shape}/SKILL.md`. Sync the nine corresponding promoted docs: engineering `prototype`, `domain-modeling`, `grill-with-docs`, `to-spec`, `to-tickets`, `improve-codebase-architecture`; productivity `teach`, `to-questionnaire`, `writing-for-agents`.

**Interfaces:** Preserve standalone server-free logic HTML; UI prototype route with `?variant=` and switcher; numbered lesson HTML with shared `assets/` and existing learning records; questionnaire `to-questionnaire-<slug>.md`; and each writing skill's selected Markdown file/approved-block format. Visualize owns direct architecture conversation rendering. Task 7 supplies reminder routing.

- [ ] **Step 1: Establish rendering and edit-preservation probes.** Use logic/UI prototypes, a lesson with stylesheet and quiz feedback, a revised questionnaire, and two writing turns with manual edits between them. Record source-only versus actually rendered evidence. Include Visualize present/absent cases.
- [ ] **Step 2: Add short capability-aware delivery steps.** Open the useful file or running route once, verify actual rendering where applicable, and return absolute file links for file artifacts. Re-read user edits before approved writes. Preserve raw writing inputs, complete candidate previews, short choices, one-block approvals, and fragment separators. Keep native source access supplementary for architecture: do not replace Visualize's inline content reference with a link to its HTML fragment or export without a request. Do not turn generated questionnaire questions into live interview questions or imply sending permission.
- [ ] **Step 3: Verify, sync docs, and commit.** Interact with prototype state/variants and lesson feedback; check assets and visible output. Confirm user edits survive, raw input bytes stay unchanged, and no message is sent. Keep architecture findings when Visualize is missing and honor its existing prerequisite. Preserve all lesson format references and domain/spec publishing behavior. Commit as `feat: present skill artifacts through native Codex panels`.

### Task 7: Handoffs, resumable orchestration, and requested follow-ups

**Files:** Modify productivity `handoff/SKILL.md`, beta `{claude-handoff,chief-of-staff,loop-me}/SKILL.md`, and productivity `teach/SKILL.md` for reminder routing. Create `skills/in-progress/chief-of-staff/STATE-FORMAT.md`; add its missing entry to `skills/in-progress/README.md`. Sync `docs/productivity/{handoff,teach}.md`. Task 8 owns final router/phase-boundary updates.

**Interfaces:** Portable handoff stays an OS-temp Markdown file with objective, constraints, accepted decisions/reasons, verified results versus assumptions, pending work/decisions, pointers, next action, and legal skill suggestions. Chief state reuses a selected artifact or `goals/<slug>.md`, with objective/constraints, evidence, active work/owners, pending decisions, next actions, and runtime pointers. Loop specs stay in `workflows/*.md` with `NOTES.md`. Native goals own lifecycle/budgets only when requested; native scheduling owns the requested future run.

- [ ] **Step 1: Establish authorization/resume probes.** Plain handoff versus explicit fork; Claude launch success/failure; existing active owner and native goal; ordinary orchestration without a goal; schedule suggestion versus explicit reminder; unchanged monitor versus periodic reminder; loop requiring an unsupported trigger. Use staged calls for side effects that cannot be isolated.
- [ ] **Step 2: Implement continuity contracts.** Keep handoff resume information independently installable and distinguish native history-retaining forks from portable files. Preserve `claude --bg` as Claude handoff's explicit target and verify launch results. Add chief state reconciliation before new dispatch, with native goals/budgets only on explicit request. Route requested later work to same-chat heartbeat by default; standalone intent chooses project/destination. Preserve quiet monitor and actual reminder semantics. Keep loop specs-only and state unsupported capabilities. A teaching reminder creates no learning evidence.
- [ ] **Step 3: Verify and commit.** With a recording Claude CLI stub, verify a summary containing newlines, backticks, dollar expressions, and a path with spaces arrives as one unchanged prompt argument; failed launches stay failures. Confirm no duplicate owner/goal, inferred budget, activation of a suggestion, or substituted Claude target. Check temp handoff links, state-file resumption, explicit fork routing, and no new beta docs/promotions. Commit as `feat: make skill handoffs and long-running work resumable`.

### Task 8: Verify distribution and synchronize the complete user map

**Files:** Modify `.agents/install-block.md`, `.agents/adr/0002-ship-as-a-claude-code-plugin.md`, `CLAUDE.md` through the existing `AGENTS.md` symlink arrangement, `README.md`, affected bucket READMEs, `skills/engineering/ask-matt/{SKILL,PHASE-BOUNDARIES}.md`, and `docs/engineering/ask-matt.md`. Reconcile other behavior docs changed in Tasks 2-7. Create `.changeset/codex-native-skills.md` with `"mattpocock-skills": minor`. Create `docs/superpowers/validation/2026-10-08-codex-native-skills-results.md` as the evidence index.

**Interfaces:** Canonical install blocks are the only source for current install commands. Native manifest and catalog from Task 1 plus edited skills are the smoke-test input. Preserve public skill URLs and upstream history/attribution. Native install examples target `martinthommesen/mp-skills` or an explicit checkout; do not imply the new package is available upstream or in a public directory.

- [ ] **Step 1: Run an isolated distribution smoke test when supported.** From an unrelated cwd, run `codex plugin marketplace add <absolute-checkout> --json`, `codex plugin marketplace list --json`, `codex plugin list --marketplace mattpocock --available --json`, and `codex plugin add mattpocock-skills@mattpocock --json` only in a verified disposable environment/test account. Inspect installed cached manifest version, exactly 27 skills, resources/icons, one intended marketplace/plugin with both catalogs present, picker invocation, and onboarding with/without a selected repo. Local cache directory `local` is not a version. If safe isolation or the UI test surface is unavailable, record the exact unverified step; do not use the normal profile or claim success from static checks.
- [ ] **Step 2: Synchronize routing and install wording.** Orientation precedes workspace setup. Distinguish internal agents, explicit native forks, portable handoffs, and chat/Git handoff, including the tool's restriction on moving the calling chat. Update canonical native/Claude/standalone routes, then actual current consumers; retain choose-one guidance and explicit local checkout instructions for unreleased changes. If native runtime smoke evidence is missing, label that status and do not describe the installation as verified. Preserve dated historical changelog/ADR observations; append the new ADR decision rather than rewriting the old experiment. Do not hand-edit generated release versions or claim release publication.
- [ ] **Step 3: Reconcile docs and release guidance.** Follow `.agents/writing-docs.md`, retaining its required section order, useful existing FAQs, absolute published links, and no install commands in skill pages. Hunt relevant existing questions/changelog before adding FAQs; use repo-local audience/dictionary sources if available, otherwise primary links. Promoted README entries link `SKILL.md`, beta listing includes chief, and no non-promoted entry appears in root/plugin sets. Update repo rules to require both native and Claude catalog/version guards. Record evidence paths and outstanding runtime checks in the results index. Commit as `docs: document Codex-native installation and skill workflows`.

### Task 9: Catalog-wide completion verification

**Files:** Update scenario/results documents and only the owning files for any discovered defects. No unrelated refactor or promotion.

**Interfaces:** Results index identifies command/probe, observed outcome, evidence path, and level: live, fixture, staged, or pending. Read the spec's 38-row coverage table as the final inventory. Static budget estimates are not measured usage.

- [ ] **Step 1: Run final deterministic checks.** Run `npm run test:plugin`, `npm run check-plugin-version`, `npm run check-plugin-catalog`, and `git diff --check`. Repeat Claude strict validation if its manifests changed, recording unavailable CLI honestly. Confirm `scripts/link-skills.sh`, frozen workflows, and bucket membership remain intact; scan changed prose for em dashes and unfinished markers.
- [ ] **Step 2: Run Plugin Eval and resource/invocation checks.** Resolve the installed evaluator, using `node /Users/t979259/.codex/plugins/cache/openai-curated-remote/plugin-eval/0.1.2/scripts/plugin-eval.js analyze <path> --format json` in this environment, or the installed `plugin-eval` entrypoint elsewhere. Analyze the native plugin and all 38 individual directories, then compare with the audit baseline. Check actual YAML/frontmatter parsing and paired invocation policies separately. Distinguish deliberate user-only trigger warnings, template placeholders, and consumer-created paths from broken bundled resources. Do not commit generated coverage/benchmark scaffolding merely to satisfy static suggestions.
- [ ] **Step 3: Complete owned workflow probes and independent review.** Re-run affected probes after fixes; ensure every spec requirement has an observed check or explicitly pending native evidence. Request the chosen method's final independent branch review against the approved spec and plan. Resolve actionable findings, rerun only relevant checks, and commit fixes with their evidence.
- [ ] **Step 4: Deliver completion evidence.** Update checkboxes and results index, record final commits and limits, open useful review/artifact panels, and give the user the implemented outcome and validation summary. Publishing, a normal-profile install, scheduling, and outbound messages occur only with the corresponding user instruction.

## Execution handoff

The plan is ready for user review. Recommend **subagent-driven execution** because the independent skill families and the distribution boundary benefit from a fresh implementer/reviewer per deliverable. Native execution is also suitable if the user prefers one implementer in this session and one independent review at the end. Start implementation only after the user reviews this plan and selects the method.
