# Feature Specification: Public Carbon Calculator

**Status:** Draft — pending source workbook audit and owner approval  
**Feature branch:** `001-public-carbon-calculator`

## User problem
A user needs to calculate a waste-management carbon result through a simple public web interface without accessing the underlying spreadsheet or requiring a Google account.

## Product decisions already confirmed
- Public web application replaces the existing spreadsheet UI.
- End users do not need Google accounts.
- The Google Sheets datastore remains private.
- Submission records and calculation-detail records are stored separately.
- Results are displayed after a successful submission.
- The user receives a downloadable report and unique submission reference ID.
- Existing formulas and assumptions are preserved; concerns are documented separately.

## In scope
- Public input interface based on the existing workbook's actual input model.
- Server-side validation and calculation execution.
- Private central persistence.
- Separate submission and calculation-detail records linked by a unique reference ID.
- Per-submission result response.
- Downloadable report.
- Clear validation, processing, and failure states.

## Out of scope unless separately approved
- User accounts or authentication for end users.
- Public browsing of submissions or a public results dashboard.
- Email delivery, payment, multi-tenant administration, or analytics dashboards.
- Changes to carbon methodology or emission factors.
- Production deployment before owner approval.

## Functional requirements
Requirements below are intentionally provisional where workbook behavior is not yet known.

- **FR-001:** The application MUST allow an end user to complete the approved calculator input flow without signing in to Google.
- **FR-002:** The server MUST validate all submitted values against rules derived from the audited workbook and approved specification.
- **FR-003:** The application MUST preserve existing calculation formulas and assumptions.
- **FR-004:** The server MUST calculate results; it MUST NOT trust client-supplied totals.
- **FR-005:** Each accepted submission MUST receive a unique, non-guessable reference identifier.
- **FR-006:** Submission metadata MUST be stored separately from calculation-detail rows and linked by the reference identifier.
- **FR-007:** A successful submission MUST return only that submission's result and reference identifier.
- **FR-008:** The user MUST be able to download a report for their completed submission.
- **FR-009:** The application MUST prevent public users from reading or enumerating other submissions.
- **FR-010:** Concurrent submissions MUST NOT overwrite or mix one another's data.
- **FR-011:** Failed persistence MUST be communicated as failure, not success.
- **FR-012:** The interface MUST provide understandable validation and error feedback.

## Open questions — resolve after workbook audit
- Exact input fields, steps, labels, units, ranges, defaults, and required/optional status.
- Exact formulas, intermediate values, output metrics, and rounding behavior.
- Submission metadata fields and detail-row schema.
- Report format and exact report contents.
- Retention, deletion, and operational access policy.
- Abuse controls and any deployment quotas or constraints.
- Whether any personal information is genuinely necessary.

## Acceptance criteria
The final, testable acceptance criteria will be completed after the workbook audit. At minimum, release requires:
- Characterization tests demonstrating parity with approved workbook cases.
- Invalid and boundary input tests.
- Isolation tests showing one submission cannot overwrite or retrieve another.
- Concurrent-write and duplicate-request tests.
- Report content and download tests.
- Privacy review confirming the spreadsheet and credentials are not exposed.
- Owner approval of the final specification and deployment configuration.
