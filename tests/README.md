# Tests

No calculation or application tests are defined yet because the source workbook has not been audited.

After the audit, add tests that characterize existing workbook behavior before refactoring. Prioritize:

- Calculation parity against workbook-known inputs and outputs.
- Server-side validation, including missing, malformed, and boundary values.
- Submission/detail relationship and unique reference IDs.
- Duplicate and concurrent submission handling.
- Isolation: a user receives only their own result.
- Report content and download behavior.

Do not create guessed fixtures or expected carbon values. Derive fixtures from the audited workbook and have the project owner approve them.
