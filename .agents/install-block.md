# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

`mattpocock-skills` is listed in **Claude Code's official marketplace** (configured name `claude-plugins-official`, source repo `anthropics/claude-plugins-official`), which every Claude Code install has out of the box. There is no marketplace to add first. Official Anthropic marketplaces have auto-update enabled by default ([discover-plugins](https://code.claude.com/docs/en/discover-plugins)), but the listing pins this repo to a commit `sha` that Anthropic moves by hand, so installed users only see a release once that pin moves (see ADR 0002's 2026-08-05 update). Never promise that updates arrive automatically or immediately; the block below says when they arrive and how to track the repo directly instead.

## Claude Code: the plugin

<canonical-block name="claude-code">

```bash
claude plugins install mattpocock-skills
```

Or, from inside a session:

```
/plugin install mattpocock-skills
```

It's in Claude Code's official marketplace, so there's nothing to add first. Updates reach you when Anthropic's marketplace moves its pin to a new release, which can lag behind this repo by days or weeks.

**Stuck on an old version?** `claude plugin list` shows what you have, and [CHANGELOG.md](../CHANGELOG.md) shows the latest release. To track this repo directly instead, switch to its own marketplace and turn on auto-update for it under `/plugin` → Marketplaces (it's off by default for marketplaces outside Anthropic's):

```bash
claude plugin uninstall mattpocock-skills@claude-plugins-official
claude plugin marketplace add mattpocock/skills
claude plugin install mattpocock-skills@mattpocock
```

</canonical-block>

## Codex: native plugin from an explicit checkout

<canonical-block name="codex-native-checkout">

This fork's native Codex package is unreleased. Use an absolute path to a checkout containing these changes; a GitHub URL does not include unpublished local work. The source fork is [martinthommesen/mp-skills](https://github.com/martinthommesen/mp-skills), with upstream authorship retained. No public Codex directory listing or upstream native release is claimed.

```bash
codex plugin marketplace add /absolute/path/to/mp-skills --json
codex plugin marketplace list --json
codex plugin list --marketplace mattpocock --available --json
codex plugin add mattpocock-skills@mattpocock --json
```

Codex CLI 0.161.0 installed and enumerated exactly 27 promoted skills from this checkout in a disposable container on 2026-10-08. Desktop picker invocation and onboarding with and without a selected repository remain unverified. See the [validation results](../docs/superpowers/validation/2026-10-08-codex-native-skills-results.md) for the exact source and evidence limits.

</canonical-block>

## Standalone files: skills.sh

[skills.sh](https://skills.sh/mattpocock/skills) copies editable skill files into the project across supported agents, including Codex and Claude Code. These commands target upstream source; they do not install this fork's unpublished changes. Use the whole-set form on `README.md`:

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add mattpocock/skills
```

Pick the skills you want, and which coding agents to install them on. **Include `ask-matt` for orientation and `setup-matt-pocock-skills` for repository configuration.**

</canonical-block>

…and the single-skill form wherever one skill is named on its own. Note that **`docs/` pages are not a consumer of this block**: ai-hero renders the install widget above the body, so a page that writes the commands out duplicates it. See [writing-docs.md](./writing-docs.md).

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add mattpocock/skills --skill=<name>
```

```bash
npx skills@latest update <name>
```

</canonical-block>

`skills@latest` is the pinned spelling in all three. The pages under `docs/` used to carry their own copy of these commands; those blocks are now deleted rather than corrected, because the site renders the install commands itself.

## Choose one route per harness

Choose the native Codex plugin, the Claude Code plugin, or standalone skill files for each harness. Plugins manage their installed copies; skills.sh writes files you own and edit. Installing the same set through both routes creates duplicate skills. A native local-checkout install is a snapshot, not a promise of automatic updates. Rerun discovery after an authorized update and inspect the reported manifest version; a cache directory called `local` is not version evidence.

Orientation comes first: invoke `ask-matt` to find your route. A selected repository needs `setup-matt-pocock-skills` before tracker-dependent work if its configuration is missing or stale. Without a selected repository, orientation can recommend stateless work and wait for a repository before setup. Naming setup never authorizes another user-only skill to run it.

## Not the install story

`.claude-plugin/marketplace.json` makes the repo its own single-plugin marketplace (`/plugin marketplace add mattpocock/skills`, then `/plugin install mattpocock-skills@mattpocock`). The official listing supersedes it. It is kept as a fallback for installing the repo directly (an unreleased commit, or a fork). Users see it in exactly one place: the "Stuck on an old version?" escape hatch in the `claude-code` block, for when the official pin lags. It is never offered as the primary route.
