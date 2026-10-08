---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

Write a portable Markdown handoff in the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows). A plain handoff invocation authorizes the document only; it does not create, fork or message a chat.

## Resume contract

Tailor the document to the next-session focus supplied by the user. Include:

- Objective and constraints, including the next session's scope and authorization boundaries.
- Accepted decisions and their reasons, including rejected approaches that affect the next action.
- Verified results with evidence pointers, commands or observations and their date; separate assumptions and unverified inherited claims.
- Pending work and decisions, blockers, active owners and runtime identifiers if any.
- Pointers to source artifacts, workspace/directory, branch and commit when applicable. Reference specs, plans, ADRs, issues and diffs instead of copying them.
- One concrete next action and the checks needed before taking it.
- Suggested skills: model-invoked skills with the loading contract above, and user-only skills as suggestions for the human to invoke.

Redact secrets and sensitive personal information before saving. Inspect current artifacts and relevant runtime state when available; if a check cannot be run, record that limit rather than claiming verification.

End the document with instructions for the receiving agent: read the source artifacts first, compare current state with the saved anchor, recheck load-bearing assumptions before acting, and reconcile active owners before dispatching duplicate work. Preserve accepted decisions unless fresh evidence or the human changes them.

## Delivery and forks

Read back the saved file and return its absolute Markdown link, with a short instruction to read it and continue. Temp storage may be cleared: identify that limitation and let the human retain the file and its referenced artifacts for a later session.

If the human explicitly asks to fork a chat, use the current host's exposed fork capability and schema when available. A native fork retains history; the portable handoff is a targeted summary. Do not create a fresh chat as a substitute for a requested history-retaining fork. Report a missing fork capability and hand over the portable file instead. Forking alone does not authorize sending a follow-up to the child; send only when the human also requests that work to continue there. Use internal collaboration agents for internal decomposition, not user-owned chats.
