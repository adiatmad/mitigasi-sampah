# Task Backlog: Public Carbon Calculator

**Status:** Discovery-first backlog. Tasks that depend on workbook details are intentionally not decomposed yet.

## Phase 1 — Source audit
- [ ] Obtain the original workbook through an approved private channel.
- [ ] Inventory worksheets, hidden sheets/rows/columns, named ranges, formulas, validations, and external links.
- [ ] Inventory existing Apps Script files and map menu/modal behavior to workbook cells.
- [ ] Identify macros, unsupported functions, volatile formulas, and external dependencies.
- [ ] Record the calculation input/output contract without changing methodology.
- [ ] Build a representative set of known-answer calculation cases.

## Phase 2 — Specification and design
- [ ] Finalize user flow and input validation requirements.
- [ ] Define submission-level schema.
- [ ] Define calculation-detail schema and relationship to submission ID.
- [ ] Define duplicate-request and concurrent-write behavior.
- [ ] Decide report format and content.
- [ ] Define retention and operational access policy.
- [ ] Finalize measurable acceptance criteria and obtain owner approval.

## Phase 3 — Implementation
- [ ] Implement server-side validation and calculation behavior.
- [ ] Implement isolated persistence for submissions and details.
- [ ] Implement unique reference IDs and duplicate protection.
- [ ] Implement safe result retrieval for the current submission only.
- [ ] Implement report generation and download.
- [ ] Implement responsive public interface and accessible feedback.

## Phase 4 — Verification and release
- [ ] Run calculation characterization/parity tests.
- [ ] Test invalid, boundary, and malformed input.
- [ ] Test concurrent and repeated submissions.
- [ ] Test partial-write recovery and error reporting.
- [ ] Verify users cannot access other submissions or private spreadsheet data.
- [ ] Verify report contents and download behavior.
- [ ] Complete deployment checklist and obtain explicit owner approval.
