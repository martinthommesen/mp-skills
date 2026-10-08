---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---

Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

Load `grilling`, then load `domain-modeling` before starting the interview. Follow both skills throughout the session.

Present the glossary and ADRs through `domain-modeling`'s saved-record handover. Keep the interview in the conversation and the records in their existing files; native panels supplement both.
