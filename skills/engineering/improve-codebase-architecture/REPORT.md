# Architecture comparisons

Choose the visual that makes the candidate's deepening apparent. The Visualize skill owns the rendering contract; this reference supplies architecture-specific diagram choices.

## Diagram patterns

| Friction | Before | After |
| --- | --- | --- |
| Calls or dependencies leak across seams | Call graph or sequence showing the crossing | The same flow through one module's interface |
| Many shallow modules scatter one concept | Separate modules and the calls between them | One deep module with those calls inside it |
| Thin modules only pass work along | Cross-section showing each pass-through | One module absorbing that implementation |
| Interface nearly matches implementation | Paired areas showing their similar size | A small interface over a larger implementation |

Use the same domain names in both views so the user can trace what moved behind the seam. Label modules, interfaces, and seams directly. Size comparisons are schematic unless supported by measurements from the code.

Show the proposed responsibilities and where tests would enter.

## Readability

Keep both views available for comparison and label them **Before** and **After**. Each diagram uses its candidate's title from the response. A static relationship diagram is enough when nodes and edges explain the change; use interaction when exploring a collapse or another change makes the deepening easier to understand.

Keep architecture explanations beside the visuals in the response. The diagram should show the structural change without needing a paragraph inside it.
