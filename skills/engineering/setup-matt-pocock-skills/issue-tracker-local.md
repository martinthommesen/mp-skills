# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (see `triage-labels.md` for the role strings)
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Create a new file under `.scratch/<feature-slug>/` (creating the directory if needed).

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Implementation claims

Implementation triage `Status:` keeps the role from `triage-labels.md`, such as `ready-for-agent`. Claiming implementation never changes it to `claimed`.

- **Claim**: re-read the authoritative issue file, skip another owner's claim, then save `Claimed by: <dev/session/agent>` near the top before dispatch. Serialize claim writes or use a shared lock; re-read to confirm the saved owner. All workers use this shared tracker path, not ticket copies in their worktrees.
- **Frontier**: exclude claimed and verified landed tickets; a blocker is satisfied when closed by the tracker convention or verified landed in the selected integration branch.
- **Landing**: keep a shared ledger of ticket path and landed commit SHA, verifying each is an ancestor of the integration tip. This keeps completed work off the frontier while any PR-based closure is deferred.
- **Release**: clear only your own claim after verified resolution by the repo's closure convention, or explicitly record retained ownership while closure is pending. Reconcile ownership before a resume or transfer. Preserve triage `Status:` and unrelated ticket content.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `Status:` line records `claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every file it lists is `resolved`.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `Status: claimed` and `Claimed by: <dev/session/agent>` and save before any work; re-read to confirm ownership. Wayfinding status is separate from implementation triage roles.
- **Resolve**: append the answer under an `## Answer` heading, set `Status: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.
