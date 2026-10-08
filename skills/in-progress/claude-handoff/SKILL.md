---
name: claude-handoff
description: Hand the current conversation off to a fresh background agent that picks up the work immediately.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

Write a portable Markdown summary in the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), then launch the requested Claude background agent seeded with it. Explicit invocation of this skill requests the Claude launch. Preserve `claude --bg` as its target, in the current working directory; do not substitute a native Codex chat or collaboration agent.

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

## Launch and verify

Always pass `--name` with a descriptive name. Pass `--` followed by exactly one unchanged prompt argument containing the saved UTF-8 summary, including line endings and trailing newlines. Use a process API with an argument array rather than interpolating summary text into shell source. Shell command substitution strips trailing newlines, and text-mode reads can normalize CRLF.

For example, when Python is available, set the two literal values to the actual saved path and display name, then run this as a safely quoted script:

```python
from pathlib import Path
import subprocess

summary_file = Path("/absolute/temp path/handoff.md")
display_name = "Fix login bug"
prompt = summary_file.read_bytes().decode("utf-8")
launch = subprocess.run(
    ["claude", "--bg", "--name", display_name, "--", prompt],
    capture_output=True,
    text=True,
)
print(launch.stdout, end="")
print(launch.stderr, end="")
launch.check_returncode()
```

Read the exit status and startup output. Report success only when the CLI confirms the background launch; retain its returned job/session identifier when supplied. A nonzero status, missing executable or ambiguous result is not a successful launch. Preserve the summary link and report the failure or uncertainty; do not silently retry or launch another target. The user manages confirmed jobs with `claude agents`. Return an absolute Markdown link to the summary either way, and explain that temp storage can be cleared. If no available process API can preserve the prompt, hand over the file and report that launch remains pending.
