---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

Load each named prerequisite by its installed-catalog identity through an eligible skill mechanism exposed by the current host. If none is available, locate it in the installed skill catalog and read its `SKILL.md`, resolving resources from that skill's directory. Check invocation policy before following it: a user-only prerequisite needs the human's explicit invocation. If a prerequisite is missing or inaccessible, report its name and stop the dependent step.

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

Run implementers in the background up to the host's actual available capacity; queue the remaining frontier. If delegation is unavailable, execute the same owned-worktree lifecycle serially. Internal agents are not user-owned chats.

Read [WORKTREES.md](WORKTREES.md) before creating, dispatching, integrating, or cleaning up a worktree. It defines the ownership record and managed-first procedure.

## Steps

1. Read the spec, tracker configuration, tickets, and blocking edges. Identify the authoritative tracker location, including the shared absolute path for a local tracker; worker worktree copies are not the claim source.
2. Optionally delegate exploration and save shared notes outside the repo, accessible to later implementers. Respect available capacity.
3. Establish an owned integration branch/workspace without disturbing existing work. Record its immutable starting SHA and keep a landed-ticket ledger alongside the shared tracker.
4. Recompute the **frontier** from tickets whose blockers are closed or verified landed in this integration branch, excluding landed and claimed tickets. Claim each selected ticket before dispatch using the tracker's implementation-claim convention. Confirm the claim and record its owner. Dispatch only as many tickets as capacity permits, each with its own owned worktree and branch created from the captured integration SHA. Each implementer loads `tdd`, implements its ticket, runs relevant checks, and returns its commit SHA and verification evidence through the completion contract in WORKTREES.md.
5. Use one integration writer. Queue completions and serialize each merge, including any merger subagent, with fresh tip checks and appropriate verification. Record a ticket as landed only after its reported commit is an ancestor of the integration tip. Recompute the frontier after every landing and claim newly ready tickets as capacity opens.
6. If the tracker closes work through PRs, or the user asks for one, open a draft PR after the first landing and mark it as closing the spec and tickets. Attach every created PR when the host exposes that capability. Keep locally landed tickets out of the frontier while PR closure is deferred. Otherwise resolve each landed ticket by the tracker's normal closure convention.
7. Once all tickets are landed, load `code-review` on the integration branch. Send all findings to one implementer under the same claim/worktree contract, integrate its fixes serially, and run focused verification of the fixes.
8. Mark an existing draft PR ready for review. Otherwise report the integration branch and resolved tickets. Report remaining claim, verification, or closure failures accurately.
9. Clean up only owned disposable implementation worktrees under WORKTREES.md. Retain the integration workspace and all needed evidence.
