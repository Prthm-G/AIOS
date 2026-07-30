# Codex diff-review task

Review the current relevant uncommitted changes.

Prioritize:

1. incorrect behavior or unsafe permissions;
2. scope violations and destructive/external side effects;
3. bridge recursion, concurrent-write, logging, or failure-handling bugs;
4. missing tests or validation;
5. maintainability concerns that create concrete risk.

Do not modify files. Return findings first with severity, evidence, and a specific fix. If no finding is verified, say so and name residual risks.
