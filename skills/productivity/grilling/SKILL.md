---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Keep the **frontier** internal: every decision whose prerequisites are already settled. Choose one ready decision and ask one focused question. Wait for its actual answer, then recompute the frontier before choosing the next question. A decision whose prerequisites are pending belongs later.

## Live questions

Use an available question tool whose current schema permits the question:

- Prefer `request_user_input_async` when available and eligible.
- Use `request_user_input` only when its current schema, mode, and request type permit it.
- On other harnesses, use `AskUserQuestion` or an equivalent as permitted by its contract.

Put one short question, your recommended answer with a brief reason, and meaningful alternatives where suitable into the tool payload. Follow its schema for freeform answers or choices. Word the question so "yes" accepts the recommendation where the interface allows it. If no suitable tool supports the question, ask one concise question in chat with the recommendation.

An async submission returning, a displayed default, or elapsed time is not the user's answer. Keep required decisions and confirmations pending until the user answers. Handle a skipped optional clarification according to the tool's contract. While an async question is pending, continue useful independent work; keep dependent decisions blocked and use the tool's documented mechanism to receive the answer.

## Facts and completion

Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it. A running exploration is an unsettled prerequisite: keep the questions downstream of it pending, and choose another ready decision while it runs. The _decisions_ are the user's: put each to them and wait.

The tree is resolved when every branch has been visited, the frontier is empty, and no decision or prerequisite remains pending. Ask the user to confirm the shared understanding through an eligible question tool, or the single-question chat fallback. Act on it only after their confirmation.
