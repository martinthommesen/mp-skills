# Owned research evidence

Wayfinder's coordinator claims and schedules research; the assigned researcher loads `research` and performs the reading in the supplied workspace. This contract carries the research context into that skill without requiring it to locate Wayfinder's files.

## Claim and dispatch

Choose the revision relevant to the map with `git rev-parse <selected-ref>^{commit}` and record the full immutable `researchSHA` before dispatch. A charting batch uses the same selected SHA even if the default branch advances. Later batches can select a new revision explicitly and record why. Only open, unblocked, unclaimed research tickets are eligible.

Serialize claim writes against the authoritative tracker. For local Markdown, use its shared absolute path, not a copied worktree ticket. Re-read before claiming and confirm the saved owner afterward; use conditional writes or a tracker lock where available. Remote trackers use the documented assignee, local trackers use `Claimed by:` and Wayfinding status. Retain the unique worker owner separately when agents share the driving dev. Skip another owner's claim; reconcile ownership before a transfer or resume.

Dispatch with all these fields:

- Question, map, ticket, tracker configuration and authoritative location, relevant context pointers.
- Confirmed claim and unique session/agent owner.
- Full `researchSHA`, intended `research/<name>` branch, returned workspace directory, managed attachment identity where available.
- Cleanup owner and explicit retention policy: keep the evidence checkout, branch, and pushed commit.
- Required local inputs and final note location, following the repo's notes convention.
- Completion: cited Markdown note path, branch, commit SHA, verified pushed ref, and ticket context pointer.

Use available agent capacity, queue excess eligible tickets, and revisit blocked tickets after their prerequisites resolve. Without delegation, perform queued research serially in the same owned contexts. Use internal collaboration agents, never create or message user-owned chats merely to dispatch research.

## Prepare the owned workspace

Inspect `git worktree list --porcelain`, existing local changes and ownership, and exposed `list_artifacts`. Reuse only a suitable active attachment owned by this research effort. Preserve unrelated dirty work and protected/shared checkouts.

When managed capabilities exist, call `create_worktree` with `allowAsync: true` and explicit `ref: researchSHA`. Follow pending `get_worktree_creation_status` with spaced polling; enter the returned workspace directory. Repair a failed registration that returns a workspace by `attach_worktree` with that path, follow any pending status, then record the attachment identity. If recovery fails, retain and report the checkout rather than create duplicates or remove it. Do not use managed APIs on a different repository as a fixture: they target the calling chat's repository.

Without managed tools, create an owned Git worktree explicitly from `researchSHA`, for example `git worktree add -b research/<name> <owned-path> <researchSHA>`. Record the actual path and CLI ownership.

Verify HEAD, branch and status in the returned workspace. A fresh workspace starts at exactly `researchSHA`; if managed creation is detached, create the intended research branch there. A resumed research branch can contain existing evidence only when its recorded base/history and owner match, and must be recorded as a resume. Inspect or recreate mismatched workspaces without resetting or overwriting work. Supply needed ignored/untracked local inputs from an authorized source; fresh worktrees do not copy them.

## Retain the result

The researcher investigates primary sources and writes one cited Markdown note. Commit the note on the research branch and push that branch to the configured remote. Verify the remote branch ref matches the reported commit, using `git ls-remote <remote> refs/heads/research/<name>` or an equivalent direct remote read. Return the branch, commit SHA, note path, and a durable source-host link pinned to that commit where possible. If no source-host link exists, use a remote/ref/SHA/path context pointer that another session can fetch.

Only after retention succeeds, record the resolution and close the ticket under the tracker's convention. Push failures are unresolved retention failures, not completed research. Keep evidence available: no research PR, no integration merge, no branch deletion, and no automatic archive or removal of the research workspace. Preserve required ignored files too. Disposable implementation cleanup does not apply to research evidence.
