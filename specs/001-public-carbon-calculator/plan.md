# Implementation Plan: Public Carbon Calculator

**Status:** Implementation draft complete; test-deployment verification and owner review remain.

## Architecture
1. Browser: responsive Indonesian-language form, result display, method/reference register, and downloadable HTML report.
2. Apps Script server: validates submitted fields, calculates results, creates a unique reference, and persists submission plus detail rows.
3. Private Google Sheets: `Submissions` and `CalculationDetails`, initialized by administrator with `setupDataStore()`.
4. Calculation module: pure functions in `Calculator.gs`, independent of spreadsheet state.
5. Concurrency: script lock serializes paired writes; best-effort rollback is attempted if persistence fails.

## Preserved calculation behavior
Values and equations are transcribed from the existing source Apps Script working material:
- 30% population adjustment.
- 0.19 ton/capita/year waste-generation default.
- Landfill constants DOC 0.182, DOCf 0.5, MCF 0.8, F 0.5, R 0, OX 0, and 16/12 conversion.
- GWP CO2 1, CH4 21, N2O 310.
- Compost factors 4.0 g CH4/kg and 0.3 g N2O/kg wet waste.
- Open-burning ratio 328.78 tonnes to 0.48766485 Gg CO2e.
- Baseline compost and mitigation open burning remain zero; bank sampah and pyrolysis emissions/credits remain zero as in the source model.

See `docs/methodology-and-references.md` for equations, attribution, and limitations.

## Verification still required in Apps Script
- Run `setupDataStore()` and inspect the private spreadsheet.
- Test a submission using a test deployment.
- Verify web-app execution identity and public access settings.
- Verify paired writes and report download in the real Apps Script runtime.
- Owner review of incomplete citations and assumptions before production release.

No deployment or production data change is included in this branch.
