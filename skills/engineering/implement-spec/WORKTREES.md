# Owned implementation worktrees

## Ownership and dispatch record

Keep one shared execution record with these fields for every dispatched ticket:

| Field | Required value |
| --- | --- |
| Inputs | Spec, ticket, tracker configuration and authoritative tracker location, blocking graph, shared notes pointers |
| Claim | Confirmed tracker claim, driving dev and unique session/agent owner |
| Revision | Full immutable `integrationSHA` from `git rev-parse <integration-ref>^{commit}` at dispatch |
| Checkout | Intended ticket branch, returned absolute workspace directory, attachment identity when managed |
| Ownership | Coordinator, integration writer, cleanup owner, disposable/protected/shared status |
| Required inputs | Needed ignored/untracked fixtures and their authorized source/preserved location |
| Completion | Ticket branch, final commit SHA, checks and results, any limitations, context pointers |

The coordinator serializes claim writes. Re-read before claiming and after saving; use conditional updates or a tracker lock when available. If another owner has claimed the ticket, skip it. Reconcile an existing claim before resuming or transferring it; do not steal claims or clear another session's ownership. Local claims are `Claimed by:` fields, separate from implementation triage `Status:`; remote claims use the documented assignee. Keep unique worker ownership in this execution record even when several agents share one dev's assignee.

## Select and prepare a checkout

Establish the integration workspace with the same ownership checks. Resolve the chosen integration starting ref to a full commit SHA before creating a new integration branch/worktree, use that SHA explicitly, and verify the actual returned path and branch. For an existing integration branch, reconcile its owner, current tip, local changes, and landed ledger before continuing. Do not create a second integration writer.

1. Inspect current status, Git worktree inventory, and, when exposed, `list_artifacts`. Prefer a suitable active attachment owned by this effort. Inspect its branch, HEAD, local changes, and ownership before reuse. A primary, pinned, protected, or shared checkout is not disposable; unrelated work stays intact.
2. On a host exposing managed worktrees, use `create_worktree` with `allowAsync: true` and explicit `ref: integrationSHA`. Omitting `ref` chooses a remote default that may differ. Use the returned workspace directory, not the calling chat's checkout. If pending, use `get_worktree_creation_status` until completion, spacing unchanged polls and doing independent work between them. If registration fails and returns a workspace directory, use `attach_worktree` with that path, then check pending status. Retain the returned attachment identity in the record. If recovery fails, report it and retain the checkout; do not create duplicates or silently remove it.
3. Without these managed capabilities, use Git worktrees with an explicit SHA, for example `git worktree add -b <ticket-branch> <owned-path> <integrationSHA>`. Record the actual path and CLI ownership. Do not invent native tools or assume a CLI checkout is managed. Use the host's branch convention for new implementation branches, such as `mt/<ticket>` in Codex.
4. In the actual workspace, verify `git rev-parse HEAD`, `git branch --show-current`, and `git status --porcelain=v1`. A fresh checkout must start at `integrationSHA`. Managed creation can return detached HEAD: establish the intended branch there with `git switch -c <ticket-branch> <integrationSHA>`. Reuse a resumed branch only when its recorded base/history, work, and owner match the ticket; record its current HEAD as a resume, not a fresh start. A mismatched checkout is inspected or replaced with a new owned one. Do not reset it onto a moving branch or overwrite existing changes.
5. Supply required ignored/untracked inputs in the new workspace from an authorized source without exposing credentials. Record how checks access them. Fresh worktrees do not carry these files from another checkout. If inputs cannot be supplied, report the affected check as unavailable or failed; a skipped key test is not a pass. Use an existing dirty checkout for verification only when its owner authorizes the exact operation and it preserves their work.

## One integration writer

Capture the current integration tip before each queued completion. Confirm the claimed worker's branch and reported SHA, and that its dispatch base is an ancestor. Synchronize the worker branch with this captured tip when necessary, resolve conflicts in an owned checkout, and rerun checks affected by the synchronization. Refresh its completion SHA afterward. Check the integration tip again before landing; if it moved, repeat synchronization and affected checks.

A fast-forward is possible only when the current integration tip is an ancestor of the completed branch. Use `git merge --ff-only <completed-sha>` when that condition holds. Otherwise synchronize and verify first, or make an explicitly reviewed integration merge under the same single writer. Parallel work does not promise fast-forwards or freedom from conflicts. Stop a failed merge, preserve the work, and resolve it before taking another completion.

Verify `git merge-base --is-ancestor <completed-sha> <integration-tip>` and record the landed ticket and SHA in the shared ledger. That ledger unblocks dependents even when remote issues stay open until a PR merges. Confirm the recorded landed commits remain ancestors when resuming; stale ledger entries are not completions. Exclude verified landed tickets from redispatch. Release only your own claims after verified closure or record retained ownership while PR closure is pending.

## Cleanup

Before cleanup, confirm commit evidence is retained on integration and any requested remote branch, checks are recorded, and needed ignored/untracked files are preserved outside the disposable checkout. Inspect changes and ownership again. Never archive or remove protected, primary, pinned, shared, unrelated, or uncertain-ownership checkouts. Preserve required ignored files explicitly: an archive snapshot does not guarantee they are saved.

Use `archive_worktree` only for an eligible managed attachment, with the exact identity returned by `list_artifacts`; retain any relevant PR identity keys returned by the host. A rejection leaves the checkout in place: report it and do not substitute shell removal. Without managed lifecycle tools, remove only an owned disposable CLI worktree through Git after the same preservation checks, without force. CLI removal is not native archival. Keep unfinished worktrees and the integration workspace available for continuation.
