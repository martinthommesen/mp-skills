---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) - not the current workspace.

Include a "suggested skills" section in the document. Name relevant model-invoked skills and include the loading contract above for the next agent. Present user-only skills as suggestions for the human to invoke.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
