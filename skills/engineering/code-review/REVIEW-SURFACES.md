# Review evidence and presentation

Read this for capture and native presentation. Use only capabilities exposed by the current host and their actual schemas. Ordinary Git/files plus a prose report remain a complete route.

## One bundle for both axes

Create a fresh private scratch directory outside the reviewed tree, so the capture cannot become its own untracked input. Record the workspace, requested scope, capture time, supplied ref/PR URL, resolved revisions, original spec/standards pointers, and any omissions. Never capture ignored files or secret material merely to make a review more complete. If a required source cannot be shared, report that limit and keep the dependent review pending.

Resolve refs as commits with `git rev-parse --verify '<ref>^{commit}'`, using proper shell quoting. Save full SHAs as data, never mutable names in later capture commands. A branch/PR review records the supplied base SHA as selection metadata, the head SHA, and `git merge-base <base-sha> <head-sha>`. Capture `git diff --binary --no-ext-diff <base-sha>...<head-sha>` and `git log <base-sha>..<head-sha> --oneline`. The committed diff transition is merge-base to head. Capture relevant blobs, Git modes and explicit path absences at the merge-base and head as the left and right snapshots, respectively; `git ls-tree -z` at each side records names/types/modes, and its blob IDs identify the captured contents. The supplied base can differ from the merge-base after independent branch changes. If its blobs are useful, label them separately as optional supplied-base context; never use them as the patch's left snapshots. For an actual PR, verify its repository, base and head against the selected diff; a URL alone does not establish scope.

For generic WIP, pin HEAD and save all three inventories, even when one diff is empty:

```sh
git diff --cached --binary --no-ext-diff
git diff --binary --no-ext-diff
git ls-files --others --exclude-standard -z
```

Write each command's raw output to a distinct bundle file. Save the index entries and modes with `git ls-files --stage -z`. Also save NUL-delimited changed-path inventories for staged and unstaged diffs (`git diff --cached --name-only -z --no-ext-diff` and `git diff --name-only -z --no-ext-diff`). If a fixed point was explicitly included with WIP, also capture its pinned committed range. Label the transitions: committed merge-base to HEAD, HEAD to index, index to working files, and untracked additions. Explicit staged-only or unstaged-only scope selects only the requested transitions; ordinary WIP includes both and untracked additions.

Read paths from NUL-delimited bytes, not whitespace or newline splitting. For each relevant tracked path, save the pinned HEAD blob, index blob (`git show ':<path>'`), and working contents as distinct snapshots when that surface is in scope. For partial staging this must retain both index and working versions. For each enumerated untracked path save its exact name, type and contents, including binary bytes. Preserve symlink targets as links/data without following them into unrelated or ignored files. Record file modes and explicit absence rather than treating deletion as an unreadable empty file. Use a manifest mapping the original path to each stored snapshot; safe opaque storage names avoid path traversal and accidental overwrites. Save `--name-status -z` inventories for each diff to retain rename old/new identities. Unresolved merges or capture errors require an explicit limit or a corrected capture before dispatch.

Do not infer empty WIP from `git diff HEAD`: staged B followed by a working restore to A has an empty net diff but two opposing patches. Ignored files stay outside normal untracked enumeration. A filename such as `new file with spaces.txt` is one NUL-delimited path, with separately captured bytes.

Capture is sequential, so detect concurrent edits before calling it stable. Check that HEAD and the captured index/worktree inventories, diff bytes, modes, absences and content hashes still match the selected state. This validation is not a second reviewer capture. If they changed during collection, discard the incomplete bundle and recapture before dispatch; do not combine different moments. Once stable, save a digest manifest and treat every evidence file as immutable. Later live changes never overwrite it.

Save the spec and standards contents alongside their original paths/URLs and revisions or capture hashes. Both axes receive the same bundle identifier, manifest and evidence files, plus their own instructions. They may inspect captured context, but may not silently read mutable workspace versions or rerun the diff recipe. If context is missing, the coordinator captures a versioned supplement and gives it to both axes before continuing. An unavailable tracker does not block an explicitly supplied local spec. No spec is skipped until the human acknowledges none exists.

## Matching native surfaces

When available, `open_in_codex` can show a review panel. Match it to the captured scope first:

| Scope | Candidate native surface | Verification |
| --- | --- | --- |
| Actual PR being reviewed/updated | Browser review target using its supported PR review URL | PR identity and current base/head equal captured revisions |
| Branch | Review target `view: branch` with a resolving `baseBranch` | Workspace HEAD equals captured head; panel base and merge-base match captured evidence |
| Staged only | Review target `view: staged` | Current index patch and contents equal capture |
| Unstaged only | Review target `view: unstaged` | Current worktree patch and contents equal capture |
| Combined WIP | Separate staged/unstaged panels where supported, plus captured untracked additions | Explain that neither panel alone represents the full bundle |

Read the actual schema before choosing a URL or target. A panel opening successfully does not prove its revisions or inclusion of untracked files. `last-turn` is not automatically branch or WIP scope. If the tool cannot select the captured workspace/base or verify scope, keep the bundle and report in prose. Do not navigate to or mutate another chat to obtain a panel.

Before emitting `::code-comment` or a PR diff link, verify the file exists on the intended side, the one-based line/range contains the cited captured text, and the displayed/current surface still matches the capture. For a branch/PR three-dot diff, left-side anchors refer to the captured merge-base revision, not the supplied base branch tip. A staged-only line may differ from the working file, so a workspace comment is not necessarily a valid staged anchor. Use the host's supported file/side semantics. Deleted or unsupported locations, or any stale revision/line, get prose naming the bundle, revision, surface and original location. Do not relocate a stale finding to a nearby line by guesswork or quietly review newer code. When a changed review is requested, make a new bundle and label it as a new review.

Attach every created PR when the host supports task attachments, and attach an existing PR when the human asks to review, update or continue work on it. A PR read only as an example, dependency or background reference is not an attachment. Merely drafting a body does not publish, push, create or update a PR. Keep Standards and Spec conclusions separate in every presentation.
