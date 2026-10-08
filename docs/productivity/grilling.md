## What it does

`grilling` is the interview loop that stress-tests a plan, a decision, or an idea before anyone acts on it. It maps the subject as a **design tree**: every decision branches into the decisions that hang off it, and interviews you branch by branch until no assumption stays unstated.

It keeps the **frontier** of ready decisions internally and asks you one focused question at a time through the available question controls. Each actual answer reshapes the tree before the next question. A question that hinges on an answer still pending waits for it, so the interview follows what you decide rather than a list written ahead of your answers.

## When to reach for it

Type `/grilling`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it on its own when a task fits. It is the only [skill](https://www.aihero.dev/ai-coding-dictionary/skill) in the grilling family that is model-invoked, so you rarely type it. Usually a skill you *did* type runs it for you.

Typing `/grilling` directly gets you the plain interview and nothing else. Where you want something more than that:

| What you have | Reach for |
| --- | --- |
| You aren't working in a working directory | [grill-me](https://aihero.dev/skills-grill-me): the same [session](https://www.aihero.dev/ai-coding-dictionary/session), under a name the agent will never fire by itself |
| You are in a working directory | [grill-with-docs](https://aihero.dev/skills-grill-with-docs): the same session, and it writes `GLOSSARY.md` and ADRs as it goes |
| An effort too big to hold in one session | [wayfinder](https://aihero.dev/skills-wayfinder): it charts a map and runs grilling inside the decision tickets |
| A question that talking cannot settle: how something should look or feel | [prototype](https://aihero.dev/skills-prototype): build the throwaway version, then come back |
| A skill of your own that needs an interview | Invoke `/grilling` from it, rather than writing another interview |

## The frontier and who decides

The skill rests on three ideas.

The **design tree** is the model of the subject: decisions with decisions hanging off them. The **frontier** is the set of decisions whose prerequisites are all settled: the only questions the agent can ask yet. It chooses one, gets your answer, and recomputes what is ready.

Each question is a short prompt with a recommended answer and meaningful alternatives where they help. The question control presents the choices; a concise chat question is the fallback when no available tool supports the request. Where the interface allows it, "yes" accepts the recommendation. You can choose another answer or explain why the recommendation misses.

The other half of the design is the split between facts and decisions. Facts are the skill's own job. When a frontier question needs something the [environment](https://www.aihero.dev/ai-coding-dictionary/environment) can settle, the agent dispatches a [sub-agent](https://www.aihero.dev/ai-coding-dictionary/subagent) to find out rather than asking you. Only the questions that depend on that research wait. Decisions are yours, and the agent must wait for your actual answers. A displayed default or time passing does not settle a decision. The tree is resolved when every branch has been visited and nothing remains pending. The agent then waits for you to confirm a shared understanding before it acts on what you agreed.

The frontier has one limit. The agent chooses it by judgement; it does not compute it from a graph. It can discover a dependency late, after asking a question too soon. Tell it when that happens so it can reopen the affected branch.

## What lives here and what lives in the wrappers

This page covers the mechanism. The wrapper skills' pages answer the questions people ask most often.

| Question | Where it is answered |
| --- | --- |
| The tree, the frontier, question controls, facts vs decisions | Here |
| How long a session should run, what to do with a question you can't answer by talking, how to avoid nodding along | [grill-me](https://aihero.dev/skills-grill-me) |
| What gets written to `GLOSSARY.md`, what becomes an ADR | [grill-with-docs](https://aihero.dev/skills-grill-with-docs) |

## Common questions

**Can I go back to one question at a time?**
That is now the default, with one focused question per question-tool call. Users who read slowly, who work in a second language, or who use the sequential format to help them focus reported that this worked better for them.

**Where did `/batch-grill-me` go?**
Into this skill. Round-based questioning shipped briefly as a separate skill, then moved into `grilling` itself. The frontier remains the way it tracks ready decisions, but questions now arrive individually through question controls. Everything built on the primitive (`grill-me`, `grill-with-docs`, `triage`, `wayfinder`) inherits that delivery. There is no separate batch or sequential skill to install.

**Asking a whole round at once must lose the questions my earlier answers would have raised. Doesn't it?**
Questions now arrive individually, and every actual answer changes what the agent can ask next. The frontier keeps questions with unsettled prerequisites pending. That still relies on the agent noticing the dependencies, so tell it when an earlier answer should change a question it has asked.

**It ran out of questions and started building.**
The confirmation gate exists for this. The skill is finished when you say the understanding is shared, not when the frontier empties. Weaker and faster [models](https://www.aihero.dev/ai-coding-dictionary/model) still skip the gate. Users report this most often on lower-effort or non-frontier models, which collapse "interview until shared understanding" into a couple of questions and an outline. If yours does it, the reliable fix is a line in your own `AGENTS.md` or `CLAUDE.md` telling the agent not to implement without permission.

**It answered its own questions instead of asking me.**
That is a bug in the run, and it is the reason the skill's text separates facts from decisions. It happens most when another skill runs `grilling` to resolve a ticket, and the agent takes that task as permission to keep moving. An async question control can let it continue independent work while you answer, but your decision stays pending. A variant that reads a GitHub issue and posts one consolidated decision memo is a different skill, because a grilling session that nobody answers has produced the agent's opinion rather than yours.

**Can I cap the number of questions?**
No, and a cap is out of scope on purpose. Some plans need three questions and some need fifty; a fixed ceiling either truncates the hard case or feels arbitrary on the easy one. The intended control is plain language. Tell it to wrap up, or stop and accept the plan where it stands. If a session is running very long, the cause is usually that the scope was too big; break the work up and grill the pieces.

**I installed `grill-me` on its own and nothing happens.**
`grill-me` is a one-line skill whose whole body is "run a `/grilling` session", so it needs this skill installed too. The same is true of `grill-with-docs`, which additionally needs [domain-modeling](https://aihero.dev/skills-domain-modeling). Installing the whole set avoids the problem; installing selectively means installing the primitives as well.

**`grill-with-docs` ran, but it never loaded `grilling`.**
This is a real bug, still unfixed, and users report it across [harnesses](https://www.aihero.dev/ai-coding-dictionary/harness) and models. A skill that names another skill does not reliably cause that skill to load, and `grill-with-docs` names two. The sign is a session that asks everything at once with no recommendations. That means the model is improvising an interview rather than running this one. Asking the agent directly whether it loaded `grilling` and `domain-modeling` usually recovers it.

## It's working if

- One focused question arrives through a question control, with a recommendation you can accept or challenge.
- A question whose prerequisite is still pending waits for that answer.
- Later questions clearly build on what you said earlier.
- It goes and looks facts up (reading files, dispatching a sub-agent) rather than asking you something it could have found out.
- Research running in the background leaves independent questions available; only the questions that depend on it wait.
- It stops at the end and asks you to confirm the understanding is shared, instead of starting work.
- It covers the whole decision tree without treating skipped or unanswered decisions as settled.

## Where it fits

`grilling` is a **primitive**, not a step you schedule: the single source of truth for the interview technique, kept in one place so every skill that needs an interview reaches for it instead of inventing one. [grill-me](https://aihero.dev/skills-grill-me) and [grill-with-docs](https://aihero.dev/skills-grill-with-docs) are its two user-invoked front doors, and `grill-with-docs` is where the main build chain begins, ahead of [to-spec](https://aihero.dev/skills-to-spec). [wayfinder](https://aihero.dev/skills-wayfinder) runs it to resolve decision tickets, [triage](https://aihero.dev/skills-triage) to grill a vague report into a workable one, and [improve-codebase-architecture](https://aihero.dev/skills-improve-codebase-architecture) to walk the tree once you have picked a candidate to deepen. When you are unsure which entry point fits, [ask-matt](https://aihero.dev/skills-ask-matt) routes you.
