# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it:

- **User-invoked**: reachable **only by the human typing its name**. Set `disable-model-invocation: true` in the frontmatter (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex). The `description` is **human-facing**: a one-line summary read by a person browsing slash-commands. Strip trigger lists ("Use when the user says…").
- **Model-invoked**: reachable by **model or user**. The default: omit `disable-model-invocation` and the `policy` block from `agents/openai.yaml`. The `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user wants…, mentions…, asks for…") so auto-invocation fires. The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_ (Reuse is the reason to extract a skill, not the test.)

Each harness excludes a user-invoked skill from the model's reach in its own way, so nothing but the human can fire it: no other skill can. A user-invoked skill may invoke model-invoked skills, but it can never reach another user-invoked skill.

Every skill also carries an `agents/openai.yaml` beside its `SKILL.md`. It holds Codex UI metadata: `interface.display_name` and `interface.short_description` for the skill picker, and, for user-invoked skills, a useful single-string `interface.default_prompt` containing `$<skill-name>` plus the `policy.allow_implicit_invocation: false` that pairs with `disable-model-invocation`. Keep the two in sync: a skill is user-invoked in both harnesses or neither.

Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

## Dependencies between them

Express dependencies as explicit instructions to **load the named skill**, not a bare `/skill` mention or a deep `../other-skill/FILE.md` reference. Keep this short loading contract inside every standalone skill that composes other skills:

> Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

Use the installed catalog's exact identity, including its plugin namespace where supplied, to select the intended skill. Do not substitute a same-named built-in or invent a tool. A Claude Code host with an eligible `Skill` tool can use it; a host without one can read the catalog's installed file. Loading by file does not bypass invocation policy.

Load prerequisites individually in the stated order. A step needing `grilling` and `domain-modeling` loads `grilling`, then `domain-modeling`, before starting the interview. Dependencies that must complete before the next step stay sequential.

This is about **operative** instructions: a skill's steps telling the agent to run another skill now. Router prose that names skills for a human to pick (`ask-matt`, bucket `README.md`s) keeps `/skill` labels and never authorizes their invocation. When a prerequisite is user-only (for example `setup-matt-pocock-skills`), tell the human to invoke it; invoking the wrapper is not invocation of that prerequisite.

Required operational references and assets belong inside the individually copied skill's directory. A model-invoked reference skill can own shared material when consumers explicitly require that installed prerequisite. Otherwise bundle required reference material with each consumer; a repository-root file cannot be a runtime dependency. Project artifacts such as a workspace glossary remain inputs discovered in the user's project.

## Passive vs active domain work

Merely _reading_ `GLOSSARY.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill. Only the active build/sharpen discipline (challenge terms, edge-case scenarios, write ADRs, update `GLOSSARY.md` inline) is `domain-modeling`.

## Live questions

Direct live user questions through an available question tool, one focused question per call. The harness's current tool schema decides eligibility, supported inputs, and how skipped optional questions are handled. Examples include `request_user_input_async`, `request_user_input`, and `AskUserQuestion`; name only tools the harness actually provides. Keep required answers pending until the user responds, and continue independent work while an asynchronous question waits. If no eligible tool supports the request, ask one concise question in chat.

Keep the delivery instruction inside each standalone skill that asks for input: a single-skill installation carries only that skill's directory. A wrapper that invokes `grilling` inherits its interview delivery. Generated questionnaires, issue-comment templates, lesson quizzes, and script prompts retain their own formats.
