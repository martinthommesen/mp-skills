## What it does

`improve-codebase-architecture` surveys a codebase for **deepening opportunities**. These are places where a shallow module (an interface nearly as complex as the thing it hides) could become a deep one. It compares them in conversation using the Visualize plugin, and then [grills](https://www.aihero.dev/ai-coding-dictionary/grilling) you through the one you pick.

It leaves the surveyed source code unrefactored. The report and the decision about which candidate to explore happen in the conversation. During grilling, it may update your domain glossary and ADRs as decisions crystallize. You do the refactor later, in a separate [session](https://www.aihero.dev/ai-coding-dictionary/session), through the normal build flow. This makes it a survey, not a refactoring tool, so you can run it on a codebase you are not ready to touch yet.

Two filters stop the report from becoming generic cleanup advice. First, every candidate must pass the **deletion test**: if you removed this module, would its complexity move behind a smaller interface, or spread across the callers? Only the first case becomes a candidate. Second, unless you point it at a specific area, it reads recent commit history first and focuses the scan on paths that change often. A deepening in code that nobody touches is a refactor that never pays back.

## When to reach for it

You invoke this by typing `/improve-codebase-architecture`; the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) will not reach for it on its own.

It is not a step in the main build loop. You run it periodically to queue up more work that improves the codebase. People use it in four situations:

| Situation | How it is used |
| --- | --- |
| Routine upkeep | Run it every few days, or when you have a spare moment, so the structure does not decay between features. |
| Before a big build | Point it at the [spec](https://www.aihero.dev/ai-coding-dictionary/spec) and ask "how can we make this change easy?" This is the most effective prompt for it. |
| Brownfield audit | Run it on a large, unstructured or [vibe-coded](https://www.aihero.dev/ai-coding-dictionary/vibe-coding) repo to find out what shape it is in. |
| Legacy test work | Use it to find the missing seams before you write tests against untestable code. |

Where it is confusable with siblings:

- To design one module you have already chosen, use [codebase-design](https://aihero.dev/skills-codebase-design). This skill finds the module to work on, and `codebase-design` is where you design it.
- For a whole effort too big to hold in one session, use [wayfinder](https://aihero.dev/skills-wayfinder).
- For "this specific thing is broken," use [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs). It sends you back here when the real finding is that there is no good seam to lock the bug down.

## Prerequisites

The Visualize plugin must be installed and available to present the report. If it is unavailable, the agent retains its findings and asks you to enable it, then resumes the report when the plugin is available.

If `GLOSSARY.md` or ADRs in `docs/adr/` exist, it reads them and uses your domain's own nouns. A candidate then reads as "deepen the Order intake module," not "refactor the FooBarHandler."

During the grilling loop it adds or sharpens terms in `GLOSSARY.md`, and creates that file if it does not exist. It also offers to record a rejected candidate as an ADR, so a future run does not suggest it again.

## Depth, and the report that hunts for it

The skill rests on one idea: **depth**. A deep module puts a lot of behaviour behind a small, stable interface. A shallow module exposes its implementation through an interface nearly as wide as the code beneath it. The report looks for three forms of shallowness:

- Pure functions extracted only for testability, while the real bugs are in how callers use them (no **locality**).
- Modules that leak across their **seams**.
- A concept you cannot understand without opening five files.

For each one, it proposes the deepening that fixes it.

Each candidate has a stable title, a before/after visual, and an explanation beside it in the response: the files involved, the friction, a plain-English solution, the benefit in terms of **locality** and **leverage**, how tests improve, and a recommendation strength. Any conflict with an existing ADR is called out beside the candidate.

| Strength | What it means for you |
| --- | --- |
| `Strong` | The deletion test passes clearly and the friction is real. Take these seriously. |
| `Worth exploring` | Plausible deepening, but the payoff depends on where the code is going next. |
| `Speculative` | Included for completeness. You can ignore most of these. |

The report shows every candidate before ending with a **Top recommendation**, the candidate it would do first. You review the completed report and answer its candidate-choice question through the harness's question tool. It waits for your choice before proposing concrete interface signatures or starting the grilling loop. At that point you have decided nothing, and the surveyed source code has not changed.

## What happens after you pick one

When you pick a candidate, a [grilling](https://aihero.dev/skills-grilling) session starts on it. It covers the constraints, what goes behind the seam, which tests survive, and what the deepened interface should look like. The output of that session is a decision, not a diff. From there the normal flow applies: take the decision into [to-spec](https://aihero.dev/skills-to-spec), then [to-tickets](https://aihero.dev/skills-to-tickets), then [implement](https://aihero.dev/skills-implement).

The interview presents one ready question at a time through the question tool and uses your answer to choose the next question.

## Common questions

**It grilled me for an hour about one idea instead of showing me options. Can I turn that off?**

Yes. Say so when you invoke it ("don't grill me, just show the report"). This is the most common complaint about the skill. One user liked it as "a convenient way to get a thorough analysis of improvements," but after the grilling loop was added, found it "borderline unusable." In their sessions it proposed a single solution and then asked "10's or 100's of questions." The design intent is that the report comes first, and the grilling starts only on a candidate you chose. But weaker [models](https://www.aihero.dev/ai-coding-dictionary/model) skip straight to an interview about the first idea they had. Results in that thread vary a lot by model. It is an open issue, and the skill does not yet have a documented no-grill mode.

**Where does the report appear?**

It appears directly in the conversation, with each candidate's explanation beside its before/after visual. Visualize handles rendering, storage, styling, and accessibility. You compare the candidates where you will choose one and discuss it.

**It gave me twelve candidates. Do I work through them in the same session or start a new one?**

Use one candidate per session. If you work through several in one conversation, the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) fills with the report, the grilling, the domain-model edits and the code changes all at once. Pick one, grill it, and carry its explanation and decision into `/to-spec`. Turn the rest into [tickets](https://www.aihero.dev/ai-coding-dictionary/ticket) that you can pick up separately later. Put the chosen improvement into a spec instead of going straight to implementation. People ask this often, and the skill itself documents no workflow for it.

**How should I prompt it?**

Prompt it with the next thing you are building. If a big build is coming up, point it at the spec and ask "how can we make this change easy?" A run with no prompt looks for hot spots on its own. That is fine for routine upkeep, but a direction makes the report actionable.

**Does it work on a large legacy codebase?**

Partly. It works well on big existing codebases that lack consistent structure, and it is the recommended upkeep tool after any one-time structural setup. But users with out-of-control projects report it "helped a little but still doesn't seem to cut it." One developer with an eight-year-old legacy codebase reported that the model went in circles, though the same skill produces a clean graph on a tidy repo. There is no dedicated `/refactor` skill for that case yet. If the codebase has no shared vocabulary, run [grill-with-docs](https://aihero.dev/skills-grill-with-docs) first to create one. That usually makes this skill's output much better.

**How is this different from `/codebase-design`?**

`/codebase-design` is a reference, not a session driver. It supplies the vocabulary (module, interface, depth, seam, adapter, leverage, locality), and this skill uses it. If you give a fresh agent `/codebase-design` as the task, it fails in a known way. It has no process of its own to follow, so the agent invents one, explores the code again, and runs for a very long time before it asks you anything. Run this skill, and let it use that one.

**Will it ever tell me the codebase is fine?**

Rarely, so know that before you start. The skill exists to output findings, so it tends to produce candidates instead of concluding that nothing is wrong. Use the recommendation strengths to correct for this. If every candidate in a report is `Speculative`, the skill found nothing.

**Does it work in Codex or another harness?**

The exploration instruction is harness-neutral: it asks for a [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) to walk the codebase. Your [harness](https://www.aihero.dev/ai-coding-dictionary/harness) needs subagent support for that step and access to the Visualize plugin for the report. If Visualize is unavailable, enable it so the agent can resume presenting the findings.

**How do I actually implement deep modules in TypeScript?**

The skill does not ship a good answer. People often ask for a `TYPESCRIPT.md` with concrete file and module layouts for the principles, and it does not exist. The skill tells you where a deepening belongs and what goes behind the seam. You must turn that into a package or directory structure yourself.

## It's working if

- The candidates name your domain's concepts, not invented class names: "the Order intake module," not "the FooBarHandler."
- The candidates are in files you edited recently, not in parts of the repo nobody touches.
- The surveyed source code stays unrefactored; glossary and ADR changes reflect decisions made during grilling.
- Every candidate has a titled before/after visual and an explanation in the conversation, followed by a top recommendation.
- Your candidate choice is collected through the question tool, and it waits for that choice before proposing concrete interface signatures or grilling you.
- Each candidate explains the payoff as locality or leverage, and says which tests get simpler, not just "this is cleaner."
- When you reject a candidate for a lasting reason, it offers to record an ADR, so the next run does not suggest it again.

## Where it fits

`improve-codebase-architecture` is **periodic maintenance**. You run it every few days, outside any chain, to queue up work, not to do it. Its neighbours:

- [codebase-design](https://aihero.dev/skills-codebase-design) owns the depth-and-seam vocabulary that every candidate uses.
- [grilling](https://aihero.dev/skills-grilling) walks the decision tree after you choose a candidate.
- [domain-modeling](https://aihero.dev/skills-domain-modeling) keeps `GLOSSARY.md` and the ADRs current as you make the decision.

Its output is an idea, which goes back into the main build flow at [grill-with-docs](https://aihero.dev/skills-grill-with-docs) or [to-spec](https://aihero.dev/skills-to-spec). Its counterpart at the end of the main flow is [retro](https://aihero.dev/skills-retro). This skill improves the code the agent works in, and `retro` improves the environment around it (checks, standards, steering files) after a build. For which skill fits a situation, [ask-matt](https://aihero.dev/skills-ask-matt) is the router over the whole set.
