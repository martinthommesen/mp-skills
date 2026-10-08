# Repository instruction entrypoints

Read both root paths and inspect their links before drafting changes. Codex starts at `AGENTS.md`; Claude Code starts at `CLAUDE.md`. An explicit bridge tells the agent to read the other file. Keep tracker, labels, and domain configuration in `docs/agents/`; entrypoints contain only short summaries and pointers.

## Choose the proposed changes

Apply the shared-file row first when both paths resolve to one file or one already explicitly delegates to the other. Otherwise use the matching existence row. A bridge is not an independent configuration file.

| Starting state | Proposed entrypoint changes |
| --- | --- |
| Neither exists | Create `AGENTS.md` with the `## Agent skills` block. Create a minimal `CLAUDE.md` bridge to it. |
| Only `AGENTS.md` exists | Update its managed block in place. Create a minimal `CLAUDE.md` bridge to it. |
| Only `CLAUDE.md` exists | Update its managed block in place. Create a minimal `AGENTS.md` bridge to it. |
| Both are independent files | Update the short managed summaries and explicit docs pointers in each. Preserve the distinct surrounding instructions; keep one configuration in `docs/agents/`. |
| Existing symlink or explicit bridge | Update the shared canonical file once. Preserve the symlink target or bridge text and any unrelated wrapper instructions. This applies in either direction. |

A new Claude bridge is:

```markdown
@AGENTS.md
```

A new Codex bridge is:

```markdown
Read and follow [CLAUDE.md](./CLAUDE.md) for this repository's instructions, including its Agent skills configuration.
```

Do not convert independent files into symlinks, move their instructions, or add reciprocal bridges. If existing links are broken, cyclic, conflicting, or point outside the repo, report that concrete conflict and resolve the intended repo files in the draft review before editing; do not silently repair or replace links. Global instructions and host settings are outside setup's scope.

## Review, update, and verify

Draft every affected file and its canonical docs before repo edits. Opening a temporary draft in an available native panel does not approve it. Apply only the changes the user approves in setup's required review.

Within `## Agent skills`, update only the managed Issue tracker, Triage labels, and Domain docs subsections. A section ends at the next heading of the same or higher level. Preserve surrounding prose and custom subsections. Add the block only if absent. Triage absent means no managed Triage labels subsection and no new `triage-labels.md`; do not remove unrelated pre-existing user files. Keep existing repo-specific doc additions when adapting seeds.

On rerun, read existing bridges first, update their canonical target, and avoid duplicate blocks, pointer lines, or imports. Unchanged answers and content should leave all bytes unchanged. Follow symlinks when writing the canonical target; do not replace the link with a regular file. Check `readlink` before and after for both directions.

After writing, inspect each host's root entrypoint and follow its explicit bridge or symlink to verify the tracker/domain pointers (and triage pointers only when configured). Confirm the docs exist and the chosen tracker is usable. A fixture read establishes a file route; actual host auto-loading needs a host execution check.
