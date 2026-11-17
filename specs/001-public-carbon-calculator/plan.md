# Implementation Plan: Public Carbon Calculator

**Status:** Draft — do not implement production behavior until workbook audit and specification approval.

## Current known constraints
- Google Apps Script web app.
- Private Google Sheets datastore.
- Public anonymous end-user access.
- Submission and calculation details stored separately.
- Existing workbook methodology must remain unchanged.
- Repository code is synchronized to Apps Script using clasp; real project configuration remains local.

## Proposed architecture (subject to workbook audit)
1. **Browser:** HTML/CSS interface. Collects inputs, performs only usability-level validation, submits input payload, and renders the response.
2. **Apps Script server:** Validates payload, runs the preserved calculation logic, creates the submission reference, persists records, and prepares report data.
3. **Private Google Sheets:** One submission-level sheet and one calculation-detail sheet, with a stable reference ID relationship.
4. **Report delivery:** Generate a report from server-verified result data and return a safe download mechanism. Exact format remains open pending owner confirmation and platform constraints.

## Design constraints
- Do not expose spreadsheet IDs, credentials, or raw sheet data to the browser.
- Do not use shared worksheet cells as mutable per-user calculation state.
- Do not trust browser-supplied calculated outputs.
- Use locking/transaction-like sequencing for related writes; define recovery behavior for partial failure.
- Keep server functions small and cohesive; avoid unnecessary frameworks.
- Preserve formula behavior and prove parity with characterization tests.

## Planned phases
1. **Discovery:** inspect workbook sheets, formulas, named ranges, validations, hidden content, and existing Apps Script behavior.
2. **Behavior baseline:** map input/output contracts and create representative known-answer cases.
3. **Specification:** finalize fields, validation, data schema, report, privacy, failure, and acceptance criteria.
4. **Implementation:** implement server and browser layers with focused tests.
5. **Verification:** parity, boundary cases, concurrency, duplicate handling, privacy, and report tests.
6. **Release preparation:** configuration guide, deployment checklist, owner review, and explicit deployment approval.

## Risks to resolve
- Apps Script execution quotas and web-app deployment identity/access settings.
- Anonymous endpoint abuse and duplicate submissions.
- Partial failure between writes to separate sheets.
- Report size, format, and download delivery constraints.
- Workbook formulas or macros that do not translate directly to Apps Script/Sheets.
