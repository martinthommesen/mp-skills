# Codex-native skills, with portable compatibility

## Intent and agreed scope

Make this repository's skills work naturally in Codex in ChatGPT desktop while retaining Claude compatibility where practical. The user selected a Codex-first catalog and approved the approach below. Success means an installed skill discovers the available host capabilities, uses the appropriate native feature, and still works when that feature is unavailable.

Keep one canonical instruction set per skill. Preserve skill names, bucket membership, public URLs, existing artifact formats, and useful Claude-specific workflows. This is a catalog-wide integration change, not a redesign of the skills' domain methods.

The audit covered all 38 skills: 20 engineering, seven productivity, seven in-progress, and four misc. The 27 engineering and productivity skills remain the promoted plugin set. Beta skills receive relevant improvements without promotion. Frozen misc skills retain their current purpose; they only need compatibility verification unless a shared packaging change exposes a real defect.

This spec covers source changes and validation. Publishing a marketplace, installing into the user's normal profile, sending messages, or activating scheduled work are separate actions requiring the corresponding user intent. Local fixtures and isolated installation checks are part of validation.

## Architecture and package boundaries

Use the existing bucketed source as the single catalog for both hosts:

- Add `.codex-plugin/plugin.json` with an explicit array of the same 27 promoted skill-directory paths used by `.claude-plugin/plugin.json`.
- Add the native marketplace catalog at `.agents/plugins/marketplace.json`, resolving its plugin source from the marketplace root to this repository's root.
- Keep the Claude plugin and marketplace. Validate coexistence of the native and legacy catalogs: one intended marketplace/plugin entry must resolve, with no duplicate discovery.
- Keep `package.json` as the version authority. Extend `scripts/sync-plugin-version.mjs` to update and check both plugin manifests. Catalog versions, if present, follow the same authority.
- Use `ask-matt` as `extensions.com.openai.onboardingSkill`. Onboarding begins with orientation because it may run without a repository. Repository setup starts only in a deliberately selected workspace.

Current Codex compatibility manifests support arrays of skill paths. A portable root `plugin.json` auto-discovers `skills/`, which would include this repository's non-promoted buckets. Do not add that portable manifest to this mixed-bucket source tree. A generated portable release package may be added later if needed, staging only the promoted directories without committing duplicate skill sources. It is not required for this change.

Keep standalone installation through the existing skill-directory route. An individually copied skill must contain its operational references and assets. It cannot depend on a repository-root adapter or on every other skill being installed.

Do not add a generic runtime skill, a custom MCP server, or mandatory dependencies on optional desktop features. Native capabilities come from the current host's exposed tools and their schemas. Preserve `scripts/link-skills.sh` as the existing developer-only utility without modification.

## Skill loading and metadata

Replace instructions that assume a literal `Skill` tool with a portable composition contract:

1. Use the host's available skill mechanism when present.
2. Otherwise resolve the named skill through the installed catalog and read its `SKILL.md`.
3. Preserve invocation boundaries. A file-read fallback does not make a user-only skill eligible for implicit invocation.
4. If a required skill is missing, report the prerequisite and use only an existing documented fallback. Do not silently approximate a workflow or assume that a wrapper installation included its dependencies.

Put essential loading and capability-selection instructions in the owning `SKILL.md`. Put longer operational guidance in references inside that skill's directory when it reduces repetition. Maintainer guidance in `.agents/invocation.md` must agree with deployed skills, but deployed skills cannot require that root file.

Preserve each skill's invocation classification. User-only skills keep both `disable-model-invocation: true` and `policy.allow_implicit_invocation: false`. Model-invoked skills remain reachable by either the model or the user. Improve user-facing metadata and add useful `interface.default_prompt` values to explicit entrypoints, including beta entrypoints where appropriate. Do not add blanket `CODEX` product restrictions or fictional skill dependencies in `dependencies.tools`.

Question tools already have a useful native route. Preserve it, matching the current tool schema. Optional preference questions may use reasonable defaults when unanswered; required decisions and approvals remain pending. Do not suggest a correct answer to a learning recall question. Reconcile the stale rejection of native question tools in `.out-of-scope/native-question-tool.md` with the current policy.

## Repository setup and navigation

`setup-matt-pocock-skills` must create instructions Codex actually loads:

- For a new repository, use `AGENTS.md` as the main instruction entrypoint and a minimal Claude bridge for compatibility.
- For an existing Claude-only repository, add an `AGENTS.md` bridge to its established instructions.
- For an existing AGENTS-only repository, preserve it and add only the needed compatibility pointer.
- When both files exist independently, preserve their contents and use explicit pointer blocks for shared skill configuration. Preserve working symlink arrangements, including this repository's current `AGENTS.md` to `CLAUDE.md` link.
- Keep `docs/agents/` as the detailed configuration source. Setup must be idempotent and must not change global Codex fallback filenames or user configuration.

Show the proposed configuration in a native file panel when available, then follow setup's existing review boundary. Opening a file is a presentation action, not approval or execution.

`ask-matt` remains the flow router. Update its onboarding and phase-boundary guidance to distinguish internal subagents, native forks retaining history, compact portable handoffs, and movement of a chat with its Git state. A user-owned chat is created or messaged only when the human explicitly requests that action. Internal decomposition uses collaboration agents.

## Execution, research, and worktree ownership

`implement-spec` and `wayfinder` prefer managed worktrees when supported, with ordinary Git worktrees as their portable fallback. Before creating one, inspect attached worktrees and reuse a suitable owned checkout. For `implement-spec`, record the integration tip as an immutable SHA. For `wayfinder`, record the explicitly selected research starting revision as a SHA; it has no integration branch. Pass the recorded ref to creation because native defaults may otherwise use the remote default branch and omit uncommitted work. Work in the returned directory and explicitly establish the intended ticket branch.

`implement-spec` maintains its existing integration branch and ticket frontier. Both workflows claim a ticket before dispatch, provide its specification or question and tracker pointers, and queue work to respect actual agent capacity. Merge completed implementation branches serially in the integration checkout. A failed attachment is repaired through the native attachment/status tools when available; do not assume that worktree creation changed the current chat's checkout.

Wayfinder research tickets have a distinct completion contract: a pushed research branch and a tracker context pointer preserve the findings, with no PR or merge. These branches are evidence and remain outside implementation cleanup. Preserve the chosen issue tracker as the authority. Standalone `research` keeps its cited Markdown-note contract without requiring a branch, push, or tracker.

Cleanup applies only to owned, disposable implementation worktrees. Use recoverable native archival when available and identify the exact attached worktree. Preserve needed ignored files. Protected, shared, primary, or otherwise unsupported checkouts remain intact with a clear explanation. Never reset an unrelated dirty checkout to make reuse convenient.

Attach every PR created by these workflows, and attach an existing PR when the user asks to review, update, or continue it. Opening or attaching a PR does not publish a review. Keep ordinary CLI Git and PR workflows as fallbacks.

## Review surfaces and debugging

`code-review` captures one stable input for its Standards and Spec axes. Resolve branch or PR revisions to SHAs and capture the requested diff. A generic work-in-progress review includes staged, unstaged, and non-ignored untracked files unless the user narrows it. Ordinary `git diff` does not capture untracked content, so snapshot that content explicitly.

Open the native review panel that matches the captured scope when possible. Add native inline comments only with verified file and line anchors supported by that surface. Recheck anchors when files change. Deleted lines or unsupported locations receive precise prose feedback. Missing specifications stay explicit; do not invent requirements. Attach a PR only when it is actually the subject of authorized work, not a background reference.

`retro` uses the current conversation by default. For a user-selected other chat, prefer native list/read tools, preserve its returned title, and page selectively. Label summaries and truncation accurately and read narrow log gaps when needed. Keep raw session logs as the portable fallback. Inspection does not authorize messaging or modifying another chat.

`diagnosing-bugs` retains its command-driven, red-capable verification loop. A human-in-the-loop script can request human input only in a verified visible interactive terminal. A hidden execution PTY is not a user terminal. If a suitable native terminal is unavailable, save the script and give the command for the user's own terminal. Opening a terminal panel alone does not prove that a reproduction ran.

## Artifact delivery and continuity

Open useful artifacts through native file or browser panels when supported: prototypes, specs, questionnaires, lesson HTML, and writing drafts. Preserve each skill's existing output format and editing loop. Architecture comparisons keep Visualize's direct conversation delivery; native source panels or verified artifact links may supplement that contract. Verify rendered browser content when rendering matters; opening a panel or an HTML fragment is not proof that the content renders. Use absolute local links as the portable delivery route for file artifacts.

Writing and questionnaire workflows keep their complete previews and short picker choices. Open a draft once when helpful, re-read user edits before applying the next approved block, and preserve those edits. Authoring a draft does not imply permission to send it.

`handoff` keeps a compact portable resume artifact. It records the objective, constraints, accepted decisions and reasons, verified results versus assumptions, pending work and decisions, workspace/artifact pointers, and the next action. Keep the temporary-file default. An explicitly requested native fork is offered through the actual fork tool and described accurately as retaining history. Do not substitute a fork for a requested portable handoff.

`claude-handoff` keeps its explicit Claude target and uses the same useful resume information. Verify the actual launch result or job identifier before claiming a transfer succeeded. Missing launch support is reported rather than silently switching targets.

`chief-of-staff` uses a durable state artifact for orchestration. Reuse a selected existing specification or goal artifact; otherwise use `goals/<slug>.md` in the selected workspace. Record objective and constraints, completed work and evidence, active work and owners, pending decisions, and the next actions. On resume, reconcile existing artifacts, in-flight agents, and any native goal before launching more work.

A native goal is created only when the user explicitly requests a goal. It owns native lifecycle and budgets; the state artifact holds detailed orchestration information. Set a native token budget only when the user supplied one. Ordinary orchestration may use a state file without creating a native goal.

Requested reminders, recurrence, monitoring, and later continuation use the native automation tool when available. Default to a same-chat heartbeat; use a standalone project job only when that is the user's intent. Record a useful resume prompt and destination. Keep a monitor quiet while state is unchanged or non-actionable unless periodic reports were requested. A reminder still fires at the promised cadence. Describing or suggesting scheduled work does not activate it.

`loop-me` remains a specifications-only workflow. Where relevant, its specification records trigger, runtime, destination, state, permission boundaries, and actionable notification behavior. Report unsupported host features explicitly. It must not activate a loop merely because its specification is complete.

`teach` preserves lesson HTML, quizzes, assets, and learning records. Native panels improve delivery. Reminders require the user's request and useful workspace pointers; they do not count as evidence of learning.

## Coverage and change ownership

The following table accounts for all 38 skills. Each row receives the applicable portable loading, metadata, and capability checks. A row marked aligned does not require a behavioral rewrite merely to add native terminology.

| Bucket | Skill | Intended change |
| --- | --- | --- |
| engineering | ask-matt | Native onboarding, accurate loading and phase boundaries, synchronized router. |
| engineering | code-review | Stable review input, matching panels, verified inline comments and PR attachment. |
| engineering | codebase-design | Aligned method; preserve references and composition. |
| engineering | diagnosing-bugs | Visible-terminal detection and portable human-input fallback. |
| engineering | domain-modeling | Open useful glossary/ADR artifacts; preserve method. |
| engineering | grill-with-docs | Portable composition and useful document panels. |
| engineering | implement-spec | Managed worktrees, capacity-aware internal agents, PR attachment, owned cleanup. |
| engineering | implement | Portable composition; preserve implementation entrypoint. |
| engineering | improve-codebase-architecture | Preserve Visualize conversation delivery and analysis method; supplement with useful artifact access. |
| engineering | pr | Preserve PR authoring; attach a created or explicitly worked PR when applicable. |
| engineering | prototype | Native running-route preview, with actual rendering verification and format fallback. |
| engineering | research | Aligned research method and portable loading. |
| engineering | retro | Native conversation inspection, honest provenance, log fallback. |
| engineering | setup-matt-pocock-skills | Loaded instruction entrypoints, compatible bridges, native draft presentation. |
| engineering | tdd | Aligned method; preserve meaningful red/green checks. |
| engineering | to-spec | Native spec presentation and portable composition. |
| engineering | to-tickets | Preserve tracker routing and composition; link useful specification artifacts. |
| engineering | triage | Portable agent/skill dispatch and existing tracker contract. |
| engineering | wayfinder | Owned research worktrees, claimed tickets, durable research evidence. |
| engineering | wizard | Preserve standalone shell wizard; use a verified visible terminal when needed. |
| productivity | grill-me | Portable composition and current native question policy. |
| productivity | grilling | Preserve questioning method and invocation policy. |
| productivity | handoff | Portable resume contract and accurate explicit native-fork option. |
| productivity | teach | Native lesson delivery, rendering evidence, requested reminder routing. |
| productivity | to-questionnaire | Editable native draft, short choices, preserved user edits. |
| productivity | wait-what | Aligned explanation method and portable composition. |
| productivity | writing-for-agents | Native artifact delivery; update bundled skill mechanics for Codex metadata and composition. |
| in-progress | chief-of-staff | Durable resume state, native goals only on request, requested automation routing. |
| in-progress | claude-handoff | Preserve Claude launch target and verify launch; improve resume payload. |
| in-progress | loop-me | Native-aware loop specifications without activation. |
| in-progress | setup-ts-deep-modules | Portable loading and instruction-entrypoint compatibility. |
| in-progress | writing-beats | Native draft presentation with existing staged approvals and user edits. |
| in-progress | writing-fragments | Native draft presentation with existing staged approvals and user edits. |
| in-progress | writing-shape | Native draft presentation with existing staged approvals and user edits. |
| misc | git-guardrails-claude-code | Verify packaging exclusion; retain explicit Claude hook behavior. |
| misc | migrate-to-shoehorn | Verify standalone compatibility; retain frozen workflow. |
| misc | scaffold-exercises | Verify standalone compatibility; retain frozen workflow. |
| misc | setup-pre-commit | Verify standalone compatibility; retain frozen workflow. |

## Documentation and migration

Update the canonical install block, then synchronize every copied install block. Lead with the verified native desktop route, retain Claude and standalone routes, and preserve the guidance to choose one installation route.

Record a dated update to ADR 0002 explaining the now-supported path arrays and new native packaging decision, preserving its historical evidence. Update invocation guidance and the bundled skill mechanics reference. Add the missing `chief-of-staff` entry to the beta bucket README without promotion.

Synchronize human-facing docs for every promoted behavior change, using the existing four-section template. Keep top-level and bucket README membership correct and update `ask-matt` when flows change. Beta and misc skills receive no new published docs pages. Follow the repository's changeset/release process and keep all prose free of em dashes.

## Acceptance and evidence

Completion requires these checks, with commands and outcomes recorded in the implementation report:

1. **Catalog integrity:** both plugin skill arrays equal the filesystem's 27 promoted directories. All 38 metadata files retain valid invocation pairs; their bundled references/assets resolve. Root README, bucket READMEs, docs, and router agree with their required scope.
2. **Version and package integrity:** version sync and read-only checks cover both plugin manifests. Meaningful deterministic tests exercise sync/check behavior and promoted-set drift. Run `claude plugin validate . --strict` after touching either Claude manifest. Avoid tests that merely match new prose wording.
3. **Native discovery:** use an isolated profile or fixture to resolve catalog/plugin paths independently of shell cwd. Inspect the installed manifest, discover exactly 27 skills with intact resources, and test native plus legacy catalog coexistence without duplicate entries. Exercise picker discovery, explicit invocation, and onboarding with and without a selected repository.
4. **Standalone composition:** copy representative skill directories and their bundled resources into an isolated installation. Exercise loading without a Skill tool, a missing dependency, and user-only boundaries. Validate resource portability for the complete catalog.
5. **Setup matrix:** exercise AGENTS-only, CLAUDE-only, independent files, symlinked files, and neither file. Preserve existing content and verify a second run makes no unintended changes.
6. **Execution and review:** in disposable repositories, exercise two independent tickets and one blocked ticket, immutable start refs, distinct branches/checkouts, serialized integration, preservation of unrelated dirty trees and research branches, attachment failure, and protected archival. Review staged, unstaged, combined work in progress, untracked files, missing specs, deleted locations, and changed anchors.
7. **Artifact and continuation flows:** verify representative prototype and lesson rendering, user edits surviving a draft update, resume-state reconciliation, and the difference between portable handoff and explicit fork. Check goal/automation authorization and unsupported-capability fallbacks without activating external work by accident.

Use available native tools for realistic forward tests when the action is in scope and a disposable fixture is sufficient. Where an actual host side effect cannot be safely isolated, record a staged or simulated tool-call check as such. Unavailable runtime support is pending evidence, not a successful test. Do not claim rendering, launch, installation, PR creation, archival, goal completion, or scheduling succeeded from instruction text alone.

## Reference points

- [Codex plugin packaging and marketplace behavior](https://developers.openai.com/plugins/build/plugins)
- [Compatibility manifest fields and path arrays](https://developers.openai.com/plugins/deploy/submission)
- [Plugin and skill metadata validation](https://developers.openai.com/plugins/deploy/submission-errors)
- [Codex instruction discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Managed Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)
- [Automations and surface constraints](https://learn.chatgpt.com/docs/automations?surface=app)
- Local tool schemas are authoritative for available app, collaboration, goal, review, and artifact operations.

This design is ready for written-spec review. Implementation planning follows that review; this document is not an implementation task sequence.
