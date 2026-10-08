---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

The caller schedules a **background agent** within available capacity, so it can keep working while the researcher reads. The assigned researcher performs the work in its supplied context and returns the artifact. If no agent slot is available, queue it; if delegation is unavailable, perform it serially.

Pass the question, relevant pointers, notes convention, claim owner where applicable, and the selected workspace. The researcher uses that supplied context.

For ordinary standalone research, use the selected workspace and return a single cited Markdown note in its existing notes convention, with an absolute path. A Git repository, committed HEAD, branch, worktree, push, or tracker is not a prerequisite. Include a starting revision only when it exists and matters to the question. Committing or publishing depends on the caller's authorized scope.

When Wayfinder supplies a research dispatch, use its question/tracker pointers, confirmed claim owner, immutable `researchSHA`, branch, returned directory, attachment identity, and retention policy. Return the cited note plus committed and verified pushed branch/SHA/path evidence for its coordinator to resolve the ticket. Keep the evidence branch and checkout, open no research PR, and never merge it into integration.

If the caller chooses an isolated research checkout, including a Wayfinder dispatch, record its branch, returned path, managed attachment identity, and cleanup owner. Use the dispatch's immutable starting SHA or record the caller's selected committed revision as a full SHA. Inspect existing worktrees and exposed attachments before reuse; preserve unrelated changes and protected/shared checkouts. Prefer an owned managed worktree created with explicit `ref: <startingSHA>` and use its returned directory; follow pending status and repair failed registration with the returned path through the exposed attach capability. If repair fails, retain the checkout and report the failure. Without those capabilities, use an owned Git worktree from the same SHA. Establish the intended branch in that directory, verify its HEAD and status before work, and supply any required ignored inputs from an authorized source. Inspect or recreate a mismatched workspace without resetting existing work.

For standalone work in an isolated checkout, bring the note into the caller's intended notes location without overwriting other work, so isolation does not hide the result. Preserve the note and needed local inputs before any owned disposable checkout cleanup. Managed cleanup uses only the eligible owned attachment's archive capability; a rejection retains it. Never remove a protected/shared checkout or treat CLI removal as native archival. Wayfinder's retained evidence checkout is not disposable cleanup.

The researcher's job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
