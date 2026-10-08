---
name: ask-matt
description: Ask which skill or flow fits your situation. A router over the skills in this repo.
disable-model-invocation: true
---

# Ask Matt

You don't remember every skill, so ask.

Before stating what a skill does or recommending a step be skipped, read that skill's SKILL.md: the summaries here are for orientation only.

If a routing decision is missing, use an available question tool to ask one focused question within its schema and eligibility. Wait for the answer before choosing that route. If no eligible tool supports the request, ask one concise question in chat.

The injected model-reachable skill list is not an exhaustive installed inventory. Before reporting a recommendation missing, inspect the installed catalog or selected plugin manifest, preserving its exact namespace and invocation policy. Reading a user-only skill to verify a description does not authorize following its workflow. Recommend a skill and stop; the human chooses and invokes it.

## Orientation before workspace setup

Start here after installation, including onboarding with no selected repository. Establish the situation before recommending workspace changes:

| Situation | Route |
| --- | --- |
| No repository selected | Orient to a stateless flow such as `/grill-me`; select a repository before setup or tracker-dependent work |
| Selected repository with usable tracker/domain pointers | Recommend the matching flow using its existing configuration |
| Selected repository whose required configuration is missing or stale | Recommend the human invoke `/setup-matt-pocock-skills`, then return to the intended flow |

On Codex, use the catalog's exact namespaced identity; native CLI discovery currently reports `mattpocock-skills:ask-matt` and the matching prefix for sibling skills. Claude slash labels below are readable route names, not permission to invoke user-only siblings.

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## The main flow: idea → ship

The route most work travels. You have an idea and want it built.

1. **`/grill-with-docs`** sharpens the idea by interview. Start here whenever you are **working in a working directory**: it's stateful, retaining what it learns in `GLOSSARY.md` and ADRs. (No working directory? Use `/grill-me` instead, covered under Standalone. Both require the installed `/grilling` primitive; a missing prerequisite is reported before the interview starts. They load it through the host's eligible skill mechanism or installed catalog file. `grill-with-docs` is the one that leaves a paper trail, which makes it the better of the two whenever a repo is there to leave it in.)
2. **Branch: can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, a UI you have to see), detour through a prototype, bridged by **`/handoff`** in both directions (a prototype lives in its own directory, which is exactly what `/handoff` is for; see Phase boundaries):
   - **`/handoff`** out, then open a fresh session against that file,
   - **`/prototype`** to answer the question with throwaway code,
   - **`/handoff`** back what you learned, and reference it from the original idea thread.
3. **Branch: is this a multi-session build?**
   - **Yes** → **`/to-spec`** (turn the thread into a spec), then **`/to-tickets`** to split it into tracer-bullet tickets, each declaring its **blocking edges**. Then work the tickets one of two ways:
     - **`/implement`** per ticket, **`/clear`ing context between each one**. On a local tracker that's one file per ticket under `.scratch/<feature>/issues/`, worked blockers-first by hand; on a real tracker the edges become native blocking links, so any ticket whose blockers are done can be grabbed. Each ticket is self-contained, so the last one's context is disposable.
     - **`/implement-spec`** for the whole spec in one run. It reads the tickets as a **task graph**, claims tickets across the ready **frontier**, runs implementers in owned worktrees up to available capacity, and serially lands everything on one **integration branch**. Reach for it when you'd rather orchestrate the build than drive each ticket yourself.
   - **No** → **`/implement`** right here, in the same context window.

   Either way, the code gets built by driving **`/tdd`** (one red-green slice at a time) and closes out with **`/code-review`**, a two-axis review (Standards + Spec) of the diff. `/implement` runs both per ticket; `/implement-spec`'s implementers each drive `/tdd`, and it runs one `/code-review` over the integration branch. Reach for **`/tdd`** on its own when you just want to build a concrete behaviour test-first without a full spec, and **`/code-review`** on its own whenever you want to review a branch or PR against a fixed point, or staged, unstaged and untracked WIP. Both axes read one frozen capture; matching native panels supplement it.

   When the work goes up as a pull request, **`/pr`** shapes the body: the smallest visual that shows the change, before/after evidence that it works, and a one-way or two-way door call. It's model-invoked, so the agent reaches for it whenever it writes a PR. Drafting a body does not publish it; separately authorized PR work attaches the created or actually worked PR when supported.

4. **`/retro`** closes the loop. It prefers current context, or reads an explicitly selected chat with its exact title and evidence limits; it proposes without managing or messaging chats. After a build, and especially one that went sideways, it looks back over the session and suggests changes to the agent's **environment**, not the code: navigation pointers, automated checks, the coding standards `/code-review` enforces, steering files, tooling. Mechanical mistakes become deterministic checks; judgement calls become coding standards. The next build then starts from a better environment.

### Context hygiene

Keep steps 1–3 in **one unbroken context window** (don't compact or clear until after `/to-tickets`) so the grilling, spec, and tickets all build on the same thinking. Each `/implement` then starts fresh, working from the ticket. Run `/retro` in the session it's looking back on, before you clear; after clearing, explicitly select the earlier chat for native reads or point it at that session's log.

The limit on this is the **[smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone)**: the window (~150k tokens on state-of-the-art models) within which the model still reasons sharply. If a session approaches it before `/to-tickets`, don't push on degraded; `/compact` at the nearest phase boundary and carry on (see Phase boundaries).

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`/triage`**. It moves issues through triage roles and produces agent-ready issues, which **`/implement`** later picks up.

  Triage is only for issues **you didn't create**: bug reports, incoming feature requests, anything that arrives raw. Tickets that `/to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`/diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It refuses to theorise until it has a **tight feedback loop** (one command that already goes red on *this* bug), then fixes with a regression test. Once the fix is in, run **`/retro`** in the same session to ask what would have prevented the bug; where the real finding is that there's no good seam to lock it down, that's a job for **`/improve-codebase-architecture`**.

- **A huge, foggy effort: a greenfield project or a huge feature build, too big for one session** → **`/wayfinder`**, the most cognitively demanding flow here. When the way from here to the destination isn't visible yet, it charts a **shared map** of **decision tickets** on the issue tracker and resolves them one at a time, producing **decisions, not deliverables**, until the fog is pushed back and the way is clear. Where **`/grill-with-docs`** sharpens an idea you can hold in one session, wayfinder is for the idea you can't, and it's slower and denser, so save it for exactly that, never a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`/to-spec`**, which collapses the map's linked decisions into a buildable plan, then `/to-tickets` and `/implement` as usual. Looping the map straight into `/implement` skips that collapse and throws the linked detail away, so go straight to `/implement` only when the effort turned out genuinely small.

## Codebase health

Not feature work, just upkeep.

- **`/improve-codebase-architecture`** runs whenever you have a spare moment to keep the codebase good for agents to operate in. It surfaces **deepening opportunities** with Visualize comparisons directly in the conversation and optional source panels alongside them; picking one _generates an idea_ you can take into the main flow at `/grill-with-docs`. It's the survey that finds the candidates; **`/codebase-design`** (below) is the bench you design the chosen one on.

## Vocabulary underneath

Two model-invoked references that run *beneath* the other skills, each the single source of truth for its vocabulary. Reach for them directly when the **words**, not the process, are the problem; or let the skills above pull them in.

- **`/domain-modeling`**: sharpen the project's *domain* language: challenge a fuzzy term, resolve an overloaded word ("account" doing three jobs), record a hard-to-reverse decision as an ADR. It's the active discipline `/grill-with-docs` drives to keep `GLOSSARY.md` a clean glossary.
- **`/codebase-design`** is the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for designing a module's *shape*: a lot of behaviour behind a small interface at a clean seam. `/tdd` and `/improve-codebase-architecture` both speak it.

## Phase boundaries

A **phase** is a chunk of work inside a session: the grilling, the implementation, the QA. At the **boundary** between two of them you have five ordinary context options, and picking between them is the fuzziest decision in this whole map:

- **Continue**: stay put. Costs nothing, loses nothing.
- **`/clear`**: empty the window, when nothing here matters to what's next.
- **`/handoff`** writes a portable markdown file with decisions, evidence, pending work and resume checks. Narrow: only for a **new harness**, a **new directory**, a **colleague**, or a side task **mid-phase**. A plain invocation writes the file; an explicitly requested native fork retains history when available, and follow-up work in its child needs the human's request too.
- **Subagent**: send a tightly-scoped task to its own window and get a report back.
- **`/compact`** compresses this context and seeds a fresh session with it. The **default**, at the bottom of the tree rather than the first reach.

Internal decomposition uses collaboration agents. A user-owned chat is created or messaged only at the human's explicit request. A native chat/Git handoff moves another chat and its Git state between checkouts or hosts; its exposed schema governs the operation, and it cannot move the calling chat itself. A portable handoff file travels independently of either tool.

Read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered tree: the five questions, the reasoning behind each branch, and why the primary-source cost makes **Continue** the one to rule out first. Make the decision **at** a boundary; mid-phase, continue or split the rest into subagents.

## Standalone

Off the main flow entirely.

- **`/grill-me`**: the same relentless interview as `/grill-with-docs`, but **stateless**: it saves nothing locally and builds no `GLOSSARY.md`. Reach for it when you are **not working in a working directory** (sharpening a plan, a design, a piece of writing, anything with no repo under it). If you are in a working directory, use `/grill-with-docs` instead: it runs the same interview and leaves a paper trail, so it is strictly the better one.
- **`/grilling`** is the interview primitive itself: a decision tree, one ready question at a time through the question tool, facts are the agent's job and decisions are yours. `/grill-me` and `/grill-with-docs` are the two named ways in, and `/triage`, `/wayfinder` and `/improve-codebase-architecture` all run it internally. Reach for it directly only when you want the interview with no wrapper around it.
- **`/prototype`** is a small, throwaway program that answers one design question: does this state model feel right, or what should this UI look like. Throwaway is a constraint on how the code is written, not a promise to destroy it: the answer folds into the real code, and the prototype itself is kept as a **primary source** on a `prototype/<name>` branch out of main, pointed at from the implementation issue. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`/research`**: delegate reading legwork to a **background agent**: it investigates a question against **primary sources**, then leaves a cited Markdown file in the repo. Keep working while it reads when the host can delegate. Wayfinder adds claimed research tickets and retained pushed evidence branches to that note workflow. The file it produces is something to take *into* the main flow at `/grill-with-docs`, since research feeds the thinking rather than replacing it.
- **`/to-questionnaire`** comes in when the thing blocking you isn't in your head or the codebase but in **someone else's**, and it writes them a questionnaire to fill in. It's the inverse of `/grill-me`: instead of interviewing you about the subject, it interviews you about the **send** (who it's going to, what you need back) and aims the questions at the gap. The editable file handover preserves returned answers; it does not send the document. What comes back is material for `/grill-with-docs` or `/to-spec`.
- **`/wizard`** is for the steps only a **human** can take: provisioning infrastructure, setting up credentials or CI secrets, clicking through an unfamiliar third-party dashboard, running a one-off migration or cutover. It generates an interactive bash script that opens each URL, captures each value, and writes it into `.env` and GitHub secrets, so the procedure stops being something you re-explain to an agent every time. It hands over the saved command for your terminal or a verified visible interactive terminal; you start and drive it. Model-invoked, so the agent reaches for it the moment it hits a wall only you can pass. If the agent could just do it itself, it should; this is for where a human is genuinely in the loop.
- **`/wait-what`** is the corrective for a message that didn't land. Use it mid-conversation, inside any other skill, and the agent re-pitches what it just said with the context you were missing, in plain English, using the `GLOSSARY.md` vocabulary. It works after the fact; `/grill-with-docs` is the upfront cure, because a shared language agreed early is what stops the jargon arriving at all.
- **`/teach`**: learn a concept over multiple sessions, using the current directory as a stateful workspace. Numbered HTML lessons and shared assets remain the learning artifacts, with rendered feedback checks when available. Explicitly requested practice reminders use native scheduling when available, defaulting to this chat; reminders create no learning evidence.
- **`/claude-handoff`** (beta): explicitly launch a Claude background agent via `claude --bg` with a portable resume summary. Use `/handoff` for a file alone or an explicitly requested native fork.
- **`/chief-of-staff`** (beta): co-ordinate long-running work with persisted state and existing-owner reconciliation. Internal work uses collaboration agents; native goals and future runs require the human's explicit request.
- **`/loop-me`** (beta): interview toward workflow specs in `workflows/*.md` and `NOTES.md`. Desired triggers and unsupported capabilities are documented; writing a spec activates nothing.
- **`/writing-beats`** (beta): shape an article one approved beat at a time in the selected Markdown file. Use it when the journey matters more than a finished outline.
- **`/writing-fragments`** (beta): mine raw writing material through an interview and append fragments to the selected file. Use `/writing-shape` when the pile is ready to become an article.
- **`/writing-shape`** (beta): turn a raw material file into an article one approved block at a time, preserving manual edits and the input file.
- **`/setup-ts-deep-modules`** (beta): wire dependency-cruiser and package pointers into a TypeScript repo so each module is reachable through its entrypoints and tests. It supplements repository setup when that TypeScript structure is needed.
- **`/writing-for-agents`** is the reference for writing documents agents consume: skills, AGENTS.md, pointed-at docs.

The frozen misc tools are individually installable and excluded from both promoted plugins: `/git-guardrails-claude-code` configures Claude hooks, `/migrate-to-shoehorn` replaces test-only assertions, `/scaffold-exercises` builds course exercise directories, and `/setup-pre-commit` configures Husky/lint-staged checks. Recommend them only for those specific tasks; they retain their existing host and project requirements.

## Precondition

**`/setup-matt-pocock-skills`**: after orientation, invoke it in the selected repository when tracker/domain configuration is needed for the intended flow. It proposes changes for review and preserves both instruction entrypoints. The router never runs this user-only skill for the human. Custom issue trackers also work.
