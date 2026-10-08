# Chief-of-staff state

Use the human-selected artifact, retaining its existing format and adding only missing continuity fields. Otherwise create `goals/<slug>.md` in the current workspace using this shape. This reference is bundled with the skill; workspace paths resolve from the workspace, not the installed skill directory.

```markdown
# <Work objective>

Updated: <timestamp>
Workspace: <absolute path>
Anchor: <branch and commit, or applicable source version>

## Objective and constraints
<Outcome, scope, authorization boundaries, acceptance criteria and user-supplied budget if any.>

## Accepted decisions
<Decision, reason and supporting source pointer.>

## Evidence
<Verified result, probe/observation, timestamp and artifact pointer.>
<Keep assumptions and unverified inherited claims explicitly separate.>

## Active work and owners
| Task | Owner | Runtime pointer | Observed status / time | Next action |
| --- | --- | --- | --- | --- |
| <bounded work> | <agent or human; intended owner before dispatch> | <identifier, pending, or unavailable> | <active, complete, failed or unknown with evidence> | <action> |

## Pending work and decisions
<Blockers, unresolved owner status, proposals that have not been activated, decisions for the human.>

## Next actions
<Concrete next action, its owner and prerequisites.>

## Runtime pointers
<Native goal ID/status/objective, automation ID/schedule/destination/status, agent IDs and source artifacts where applicable. Use absent/unavailable when no runtime exists. Record the human request that authorized creation and any user-supplied budget; do not infer either.>

## Resume
<Read linked source artifacts; compare current state with anchor; inspect runtime pointers; reconcile active owners/goals/automations before new dispatch; recheck load-bearing assumptions.>
```

Native pointers identify runtime state; they do not recreate it or transfer authorization to a new objective. Preserve absent, stale, inaccessible and verified states distinctly. A completed subtask is evidence toward acceptance criteria, not automatic completion of the overall objective. Persist changes before the next dispatch and after meaningful results.
