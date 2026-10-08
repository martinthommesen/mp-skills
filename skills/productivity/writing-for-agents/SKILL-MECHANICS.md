# Skill mechanics

The skill-specific branch of [`writing-for-agents`](SKILL.md): what changes when the document is a skill (frontmatter, the invocation choice, and router skills). The invocation and composition rules below stand alone. When the full skill is installed, `SKILL.md` supplies the universal writing reference.

## Invocation

Two choices, trading the two loads:

- A **model-invoked** skill keeps a `description`, so the agent can fire it autonomously, and other skills can reach it. You can still type its name: model-invocation always _includes_ user reach; a description only ever adds agent discovery, never removes the human's. The description is the skill's top-level context pointer, forced to stay loaded at all times: permanent context load in exchange for discoverability. A model-invoked skill whose content is all reference is also one home for shared reference: another skill can invoke it, so reference needed by several skills lives in one place. Mechanics: omit `disable-model-invocation` and the Codex `policy` block in `agents/openai.yaml`. Write a model-facing description naming the distinct conditions that should trigger it.
- A **user-invoked** skill strips the description from the agent's reach: only the human typing its name can invoke it, and no other skill can. Zero context load, but it spends cognitive load: you are the index that must remember it exists. Mechanics: set `disable-model-invocation: true` and pair it with `policy.allow_implicit_invocation: false` in `agents/openai.yaml`; the `description` becomes human-facing: a one-line summary, trigger lists stripped. Give the picker a useful single-string `interface.default_prompt` containing `$<skill-name>`.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and pay no context load.

## Composition and copied resources

Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

Load prerequisites individually in the stated order; a dependent step waits for its prerequisite to finish. Refer to the installed catalog's exact skill identity, including its plugin namespace when supplied, rather than a same-named built-in.

Required operational references and assets must travel inside an individually copied skill directory. Two user-only skills cannot invoke each other to share material. Bundle the required plain reference in each consumer, or give it a model-invoked reference skill that consumers explicitly require as an installed prerequisite. A repository-root reference is maintainer guidance, not an installed runtime dependency. Project documents such as a workspace glossary remain inputs to discover in the user's project.

## Splitting by invocation

The invocation cut of splitting (the sequence cut lives in `SKILL.md`): split off a model-invoked skill when you have a distinct leading word that should trigger it on its own (a trigger word you actually use in your prompts), or another skill must reach it. You pay context load for the new always-loaded description, so that independent reach has to be worth it.

## Router skills

When user-invoked skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill**: one user-invoked skill that names the others and when to reach for each, so the human has one skill to remember instead of many. It can only hint, never fire them: user-invoked skills have no description, so nothing but the human can reach them.
