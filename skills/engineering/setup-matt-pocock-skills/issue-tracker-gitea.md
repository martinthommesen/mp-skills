# Issue tracker: Gitea

Issues and specs for this repo live as Gitea issues. Use the official [`tea`](https://about.gitea.com/products/tea/) CLI, including on self-hosted instances.

## Connection

- **Instance web base URL**: `<base-url>` (include any web port or subpath; an SSH remote doesn't establish these).
- **Repository**: `<owner>/<repo>`.
- **Tea login**: `<login-name>`.

Setup fills these fields from confirmed repo information. Use an authenticated `tea` login for this instance (`tea login add --help` covers registration). Keep credentials in the login, outside repo files. Check `tea --version` and relevant help; commands below were checked with `tea` 0.15.1.

Run inside the clone so `tea` can infer the repo and login from its remotes. When inference is ambiguous, pass `--login <login-name> --repo <owner>/<repo>` to each command. Verify the target with `tea api --include 'repos/{owner}/{repo}'` before writing. API placeholders resolve from that same context.

For every `tea api` request, inspect the HTTP status from `--include` (stderr) and the response body. `tea` 0.15.1 can exit successfully on an HTTP error. Re-read after writes to confirm the changed body, labels, assignees, dependencies, or state before reporting success. List endpoints with `page` / `limit` need successive pages until an empty page; `tea api` doesn't paginate automatically. Its stdout is the raw response, while native list `--output json` is a projection that omits full issue data.

## Conventions

- **Create an issue**: `tea issues create --title "..." --description "..."`. `--description` takes literal text. For a body saved in a file, use `tea api --include --method POST 'repos/{owner}/{repo}/issues' -f title="..." -F body=@/path/to/body.md`.
- **Read an issue**: `tea api --include 'repos/{owner}/{repo}/issues/<number>'`, then `tea api --include 'repos/{owner}/{repo}/issues/<number>/comments?page=1&limit=50'` for all comment pages. The issue's `comments` field is a count.
- **List issues**: `tea api --include 'repos/{owner}/{repo}/issues?state=open&type=issues&page=1&limit=50'`. Page through results, then filter by configured label names and sort by creation time as the calling skill requires. `type=issues` keeps PRs out of the issue queue.
- **Edit the body**: read the current body, preserve unrelated content, then `tea issues edit --description "..." <number>`, or `tea api --include --method PATCH 'repos/{owner}/{repo}/issues/<number>' -F body=@/path/to/body.md` for a file.
- **Link a child to a parent**: put `Part of #<parent>` at the top of the child body. This is the parent-link convention for tickets and maps.
- **Comment**: `tea comments add <number> "..."`. For a saved body, `tea api --include --method POST 'repos/{owner}/{repo}/issues/<number>/comments' -F body=@/path/to/comment.md`.
- **Apply / remove labels**: `tea issues edit --add-labels "..." <number>` / `tea issues edit --remove-labels "..." <number>`. These preserve unrelated labels. Ensure names exist first; unknown names can be silently skipped.
- **List / create labels**: `tea labels list --output json --page 1 --limit 50`, followed by all remaining pages. Inspect stderr as well as the result: a label-list failure can return partial data with exit 0. Establish a complete successful list before creating missing names with `tea labels create --name "..." --color "#ededed" --description "..."`. Preserve existing labels and colors.
- **Close / reopen**: post the explanation first, then `tea issues close <number>` / `tea issues reopen <number>`.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, use the same triage labels and states:

- **Read a PR**: `tea api --include 'repos/{owner}/{repo}/pulls/<number>'`, all issue-comment pages as above, and `tea api --include 'repos/{owner}/{repo}/pulls/<number>.diff'` for the diff.
- **List external PRs**: page through `tea api --include 'repos/{owner}/{repo}/pulls?state=open&page=1&limit=50'`. External means the author is neither the repo owner nor a user returned by `tea api --include 'repos/{owner}/{repo}/assignees'` (users with write access, including organization/team access). Compare `user.login` against those logins. If access cannot be checked, report that gap before classifying authors.
- **Comment / label / close**: `tea comments add <number> "..."`, `tea pulls edit --add-labels "..." <number>` / `tea pulls edit --remove-labels "..." <number>`, and `tea pulls close <number>` after posting the explanation.

Gitea shares one number space for issues and PRs. Resolve a bare `#42` with the issue API: a non-null `pull_request` field identifies a PR. Fetch PR metadata and diff when it is one.

## When a skill says "publish to the issue tracker"

Create a Gitea issue.

## When a skill says "fetch the relevant ticket"

Read the issue and all comments as above.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: an issue labelled `wayfinder:map`, holding Notes / Decisions-so-far / Fog. Ensure the needed `wayfinder:` labels exist with the label commands above, then `tea issues create --title "..." --description "..." --labels "wayfinder:map"`.
- **Child ticket**: an issue with `Part of #<map>` at the top and a `wayfinder:<type>` label (`research`/`prototype`/`grilling`/`task`). Add its link to an ordered task list in the map body. Once claimed, assign it to the driving dev.
- **Blocking**: use Gitea's [native dependencies](https://docs.gitea.com/api/1.24/operations/issue-create-issue-dependencies/): `tea api --include --method POST 'repos/{owner}/{repo}/issues/<child>/dependencies' -f owner=<blocker-owner> -f repo=<blocker-repo> -F index=<blocker-number>`. The payload identifies the blocker by owner, repo, and displayed issue number, not database id. Read blockers with `tea api --include 'repos/{owner}/{repo}/issues/<child>/dependencies?page=1&limit=50'`. On an instance without dependency support, use a `Blocked by: #<n>, #<n>` line in the child body. A 404 alone doesn't establish this: confirm the child and blocker exist, access is valid, and the instance lacks the endpoint before using the fallback. A ticket is unblocked only when every blocker is closed.
- **Frontier query**: read the map's task list in order and fetch each open child. Drop children with any open blocker (all native dependency pages, or fetch every issue in the `Blocked by` line) or any assignee; first remaining child wins.
- **Claim**: get the authenticated user's `login` with `tea api --include user`, then `tea issues edit --add-assignees <username> <n>`, the session's first write. Use the actual username.
- **Resolve**: `tea comments add <n> "<answer>"`, then `tea issues close <n>`, then update the map's task list and append a context pointer (gist + link) to Decisions-so-far using **Edit the body**.
