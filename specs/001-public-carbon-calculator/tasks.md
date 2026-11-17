# Task Backlog: Public Carbon Calculator

## Completed in this implementation branch
- [x] Extract existing calculation constants and equations from source Apps Script working material.
- [x] Implement the preserved calculation model as pure functions.
- [x] Build the public input interface and server-side validation.
- [x] Add private submission and calculation-detail persistence.
- [x] Add unique submission reference IDs and locked paired writes.
- [x] Add result breakdown and downloadable HTML report.
- [x] Display formulas, parameter values, reference attribution, and evidence status.
- [x] Document model limitations without changing methodology.
- [x] Add deterministic calculation tests.

## Required before production use
- [ ] Run calculation tests in a local Node.js environment.
- [ ] Run `setupDataStore()` from Apps Script editor and confirm spreadsheet remains private.
- [ ] Test valid and invalid submissions in a test deployment.
- [ ] Verify execution identity and public deployment settings.
- [ ] Verify concurrent submissions and failure/rollback behavior in Apps Script.
- [ ] Review incomplete BPS/IPCC/KLHK citations and validate 30% and open-burning assumptions.
- [ ] Owner approval of source register and release.
