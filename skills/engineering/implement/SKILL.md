---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

If the user passes a ticket reference, fetch it from the issue tracker and state its title before starting. If the reference is ambiguous, clarify which ticket they mean before implementing it.

For that clarification, use an available question tool within its schema and eligibility, one focused question per call. Keep the required answer pending until the user responds; continue independent work while an async question waits. If no eligible tool supports the request, ask one concise question in chat.

Call the Skill tool with "tdd" where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, call the Skill tool with "code-review" to review the work.

Commit your work to the current branch.
