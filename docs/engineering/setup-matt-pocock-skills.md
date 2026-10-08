## What it does

`setup-matt-pocock-skills` answers three questions about one repo: where issues live, what the triage labels are called, and where the domain docs sit. It records the answers as markdown files under `docs/agents/`.

Those files are the only thing that varies between repos. The skills themselves are identical everywhere. They read `docs/agents/issue-tracker.md` at run time and do what it says. That is why the set is not tied to GitHub, and why you never edit a skill file to point it at another tracker. Invoking it with "link the skills to a custom issue tracker" works with anything you can connect to programmatically, with no changes to the skills.

It is a prompt-driven skill, not a deterministic script. It reads your `git remote`, `AGENTS.md`, `CLAUDE.md` and `GLOSSARY.md`, proposes what it found, and waits for you to confirm before it writes repo files. Temporary drafts open in native panels when the host supports them, or appear in chat. Opening them does not approve the changes.

## When to reach for it

You invoke this by typing `/setup-matt-pocock-skills`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) won't reach for it on its own. Its metadata marks it non-invokable on purpose, so no other skill can fire it for you.

Start with [ask-matt](https://aihero.dev/skills-ask-matt) for orientation, then reach for setup in the selected repository when tracker-dependent engineering work needs configuration. If [triage](https://aihero.dev/skills-triage), [to-spec](https://aihero.dev/skills-to-spec), [to-tickets](https://aihero.dev/skills-to-tickets) or [wayfinder](https://aihero.dev/skills-wayfinder) start guessing where your issues go, or apply labels your tracker doesn't have, this repo has not been set up yet. You can run it in a repo halfway through a project. The skill reads what is already there, so no earlier work is lost.

## Prerequisites

It writes into the repo you run it in:

| It writes | Where |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`, only when the `triage` skill is installed |
| Short configuration pointers | `AGENTS.md` and `CLAUDE.md`, directly or through a preserved bridge or symlink |

You commit all of it as markdown. There is no user-level or global mode. The config lives in the repo, so every repo gets its own copy.

## The three decisions

It starts each section with the recommended answer, and skips any question its exploration already answered. Most runs need only two confirmations.

Choices and draft review use an available question tool when it supports the request, one focused question at a time. Otherwise the agent asks one concise question in chat. Required answers stay pending before the related edits, while the agent can continue independent work.

| Decision | What it proposes | When it asks |
| --- | --- | --- |
| **Issue tracker** | the one matching your `git remote` | always, because this is the one real choice |
| **Triage labels** | keep the five canonical names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) | only if the `triage` skill is installed |
| **Domain docs** | single-context: one `GLOSSARY.md` plus `docs/adr/` at the root | only if it spots monorepo signals, and then it offers a multi-context `GLOSSARY-MAP.md` |

The tracker options:

| Option | Where issues live | Needs |
| --- | --- | --- |
| **GitHub** | the repo's GitHub Issues | the `gh` CLI |
| **GitLab** | the repo's GitLab Issues | the `glab` CLI |
| **Gitea** | the repo's Gitea Issues, including self-hosted instances | the official `tea` CLI |
| **Local markdown** | files under `.scratch/<feature>/` in this repo | nothing, not even a remote |
| **Other** | wherever you say | one paragraph from you describing the workflow |

The first four ship as templates in the skill and work out of the box. Gitea setup records the instance's web base URL, repository, and `tea` login, then checks read-only access. It proposes Gitea when the remote or repo instructions identify it; a generic Git host alone does not. You can also select it yourself. Local markdown is a full option, not a fallback. The skill supports a solo project with no remote. One caveat: don't use local markdown if you use GitHub. They are alternatives, so pick one.

The Gitea template uses native `tea` commands, keeps map-to-child relationships as links in issue text, and uses native blockers where available, with `Blocked by` links as a fallback. The GitHub, GitLab and Gitea templates all leave the "PRs as a request surface" flag off by default. Enable it in `docs/agents/issue-tracker.md` if you want external pull requests in the triage queue.

"Other" is a full option too. It is how Jira, Linear, Azure DevOps and Beads all work. You describe the workflow, the skill records your prose in `docs/agents/issue-tracker.md`, and the downstream skills follow the prose. Users have already built this: a Jira-over-[MCP](https://www.aihero.dev/ai-coding-dictionary/mcp) variant and a hand-built local dashboard.

The tracker templates also define implementation claims. Remote trackers use assignees; local Markdown uses `Claimed by:` while keeping triage `Status:` unchanged. A shared record of verified landed commits lets implementation continue when ticket closure waits for a PR. Wayfinding keeps its own decision-ticket status and records an owner before research dispatch.

## Common questions

**Do I have to use GitHub?**

No. GitHub, GitLab, Gitea and local markdown under `.scratch/` all ship as ready-made templates, and anything else works through the "other" path. This is the most-repeated question, in roughly these words: *"hard locked to github"*, *"can I use GitLab / Jira"*, *"what about Azure DevOps"*. The answer is always the same: setup chooses the tracker, not the skill.

**Do I need to re-run it after updating the skills?**

The direct answer after v1.1 was yes. The skill's own closing message is softer. It tells you to re-run only to switch trackers or start over. Both are defensible. The seed templates change between versions, so a `docs/agents/issue-tracker.md` from an older release can go out of date against the skills that now read it. If a downstream skill does something different from what the docs describe, re-run setup. It is cheap.

**It wrote to `CLAUDE.md`, but I'm on Codex.**

Setup now gives each [harness](https://www.aihero.dev/ai-coding-dictionary/harness) an entrypoint to the same configuration. It proposes the changes for your review before editing them.

| What your repo has | What setup proposes |
| --- | --- |
| Neither file | `AGENTS.md` with the configuration pointers, plus a minimal Claude bridge |
| Only `AGENTS.md` | Preserve it and add a Claude bridge |
| Only `CLAUDE.md` | Preserve it and add a Codex bridge |
| Two independent files | Preserve each file's instructions and add explicit pointers to the same docs in both |
| A symlink or explicit bridge in either direction | Update the canonical file once and preserve the link or bridge |

The configuration stays in `docs/agents/`. Rerunning with the same choices updates existing pointers in place, without adding duplicate blocks. An existing `CLAUDE.md` containing only `@AGENTS.md` remains a bridge; setup edits `AGENTS.md`.

**It didn't create my triage labels.**

When `triage` is installed, setup creates any missing configured triage labels on GitHub, GitLab or Gitea and preserves labels that already exist. `docs/agents/triage-labels.md` records the *mapping*: which strings in your tracker correspond to the five canonical roles. If you use custom names, setup creates only the missing labels from that mapping. Without `triage`, it skips both the mapping and label creation. Missing CLI access, authentication, or failed label creation stays outstanding in the closing report.

[Wayfinder](https://aihero.dev/skills-wayfinder)'s `wayfinder:map` and `wayfinder:<type>` labels are separate. Setup does not create them. They must exist before publishing maps and children; the Gitea template includes creation as part of wayfinding.

**Can I configure the other skills' behaviour here ([grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) cadence, question format, tone)?**

No. It configures three things: tracker, labels, doc layout. Users have asked to make it the place for per-user preferences. The answer is that skills stay opinionated and take no per-user config. Preferences belong in your repo instruction files as plain instructions.

**Can I keep the config in `~/.claude` instead of committing it to every repo?**

Not today. A user who runs the skills across many repos has an open request for this, but no user-level mode exists. Every repo carries its own `docs/agents/`.

**Isn't it strange to have a skill that configures the other skills?**

One long-standing complaint says yes, in these words: *"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."* The trade-off is real. Without a setup step, every skill that touches issues would need its own copy of the tracker instructions. The output is markdown you can read and edit, and that limits the risk. You can read every file it wrote and change it by hand. Make day-to-day changes that way, not with another run.

## It's working if

- `docs/agents/issue-tracker.md` and `docs/agents/domain.md` exist, plus `triage-labels.md` if `triage` is installed.
- Both `AGENTS.md` and `CLAUDE.md` lead to the configuration pointers, directly or through a bridge or symlink. Your existing instructions and link targets remain intact.
- The tracker it proposed matches the remote you use, and the label strings match labels that exist in your tracker.
- Afterwards, `/to-tickets` publishes without asking you where issues live, and `/triage` applies labels rather than inventing them.
- Local implementation claims show an owner without replacing triage roles; remote claims appear as assignees.
- Nothing in the skill files themselves changed. If setup edited a `SKILL.md`, something went wrong.

## Where it fits

`setup-matt-pocock-skills` is the **run-once setup** for tracker-dependent engineering work. Orientation with [ask-matt](https://aihero.dev/skills-ask-matt) comes first; configuration then supplies the preconditions that route needs. Its neighbours are its readers: [triage](https://aihero.dev/skills-triage), which applies the label vocabulary written here; [to-spec](https://aihero.dev/skills-to-spec) and [to-tickets](https://aihero.dev/skills-to-tickets), which publish into the tracker named here; and [wayfinder](https://aihero.dev/skills-wayfinder), which reads the "Wayfinding operations" section of the same tracker file to learn how to store maps and child [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket). [domain-modeling](https://aihero.dev/skills-domain-modeling) later fills in the domain-doc layout that setup records. It creates `GLOSSARY.md` and ADRs only when you resolve a term or decision, so a repo with no domain docs after setup is normal. For which skill to reach for next, [ask-matt](https://aihero.dev/skills-ask-matt) routes the whole set.
