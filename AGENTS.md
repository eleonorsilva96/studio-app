<!-- BEGIN:nextjs-agent-rules -->

# Code Review Rules

For every code review, including automatic pull request reviews, when the user requests a CRAFT review, analyze the requested MR / code / branch based on these five main aspects. Use exactly these categories and sub-categories.

For review comments, treat these sections and sub-sections one by one. Do multiple passes with explicit focus on these subjects. In your review summary, include C, R, A, F, T one-liners that tell in one glance how well the code is crafted. Observe our other rules for writing style.

C - Correctness

- Expected behavior: Does the change implement the intended behavior?
- Edge cases: Does the change handle relevant edge cases correctly?
- Data integrity: Does the change preserve data and schema integrity?

R - Resilience

- Failure & recovery: Does the change handle failures and errors as gracefully as possible?
- Resources & performance: Does the change manage resources efficiently and safely?
- Security: Protection against vulnerabilities, unauthorized access, and unintended data exposure.
- Observability: Does the change include needed logging, metrics, and alerts?

A - Architecture

- Structure & boundaries: Does the change preserve clear responsibilities and boundaries?
- Abstractions: Does the change introduce appropriate and well-scoped abstractions?
- Dependencies: Are new or changed dependencies appropriate?
- Data & API design: Does the change maintain sound interfaces, data models, and compatibility?
- Complexity: Does the change avoid unnecessary design complexity?

F - Form

- Naming: Are new or changed names clear and meaningful?
- Readability: Is the new or changed code easy to understand?
- Style & consistency: Does the change follow established conventions?

T - Tests

- Coverage: Does the change adequately test the new or changed behavior?
- Test level: Is the new or changed behavior tested at the appropriate level?
- Test validity: Do the new or changed tests actually verify the intended behavior?

<!-- END:nextjs-agent-rules -->
