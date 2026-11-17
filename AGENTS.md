# Repository working agreements

## Scope and source of truth
- Treat the existing Excel workbook and its current formulas as the calculation baseline until audited.
- Do not change formulas, emission factors, units, boundaries, defaults, or methodology without explicit owner approval.
- Separate observed defects from methodological concerns; document both with evidence.
- The repository is public. Never commit secrets, private spreadsheet identifiers, personal data, private submissions, or unapproved source workbooks.

## Engineering approach
- Read the relevant code, specification, and tests before editing.
- Prefer the smallest maintainable change that satisfies an approved requirement.
- Avoid speculative abstractions, unnecessary dependencies, premature generalization, and cosmetic churn.
- Keep browser-facing code separate from privileged server-side Apps Script operations.
- Validate all untrusted input on the server. Client validation is usability support, not a security boundary.
- Treat every submission as an independent record; never use shared mutable calculation cells as a multi-user transaction mechanism.
- Protect writes against concurrency and duplicate submissions.
- Return only the current user's result. Do not expose spreadsheet contents or other users' submissions.

## Specification and verification
- Update the relevant specification and acceptance criteria before implementation when behavior changes.
- Add or update tests for each behavior change.
- Run relevant checks, inspect failures, and report exact evidence.
- Do not claim a test, deployment, or security property has been verified unless it has actually been checked.
- Record assumptions and unresolved decisions instead of silently guessing.

## Change discipline
- Preserve unrelated work.
- Do not introduce a new framework or dependency without a concrete requirement.
- Do not deploy or modify production data without explicit approval.
