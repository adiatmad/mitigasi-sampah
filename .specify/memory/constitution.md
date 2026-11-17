# Mitigasi Sampah — Project Constitution

## 1. Preserve the calculation contract
The current workbook is the baseline for calculation behavior. Preserve every existing formula, factor, assumption, unit, boundary, and rounding rule unless the project owner explicitly approves a change. Record suspected errors separately with reproducible evidence.

## 2. Privacy by design
The web application is public; its Google Sheets datastore is private. Anonymous users may submit calculations but must not be able to read, enumerate, or infer other submissions. Never commit credentials, private spreadsheet IDs, personal data, or operational records.

## 3. Server-side authority
The server owns validation, calculation execution, persistence, and report data. Browser-side validation exists only to improve usability. Never trust client-supplied calculated totals or identifiers.

## 4. Isolated and reliable submissions
Each accepted submission receives a unique reference ID. Store submission-level metadata separately from calculation-detail rows, linked by that ID. Use concurrency control and idempotency/duplicate protection appropriate to the final design. A failed write must not be reported as a successful submission.

## 5. Simplicity over machinery
Prefer the smallest design that meets the approved requirements. Avoid unnecessary frameworks, dependencies, layers, abstractions, and features. Add complexity only to address a demonstrated requirement or risk.

## 6. Accessibility and usability
The public interface must be usable on common mobile and desktop browsers, communicate validation and failure clearly, and avoid requiring a Google account for end users.

## 7. Specification before implementation
Every material feature must have documented user behavior, constraints, and testable acceptance criteria before implementation. Keep specification, plan, tasks, and tests aligned.

## 8. Evidence-based completion
Inspect before changing. Test behavior, inspect failures, and iterate within a sensible retry budget. Report what changed, what was tested, what passed, and what remains unverified. Never imply deployment or production readiness without evidence.

## 9. Owner approval for consequential changes
The project owner controls methodology and deployment. Obtain explicit approval before changing calculation methodology, exposing source data, changing access boundaries, or deploying to a live production environment.
