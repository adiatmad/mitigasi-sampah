# Feature Specification: Public Carbon Calculator

**Status:** Implementation draft — owner review required before production deployment.

## Confirmed product decisions
- Public web application; end users do not need a Google account.
- Private Google Sheets datastore.
- Separate submission and calculation-detail records linked by a unique reference ID.
- Server-side calculation and validation; no browser-supplied totals are trusted.
- Results shown after successful persistence.
- Downloadable HTML report containing result, formulas, parameter values, and source-status register.
- Preserve the existing calculation values and equations; document concerns separately.

## Functional requirements
- **FR-001:** Collect location, six RW population values, waste-generation rate, baseline open-burning and landfill tonnage, and mitigation composting, bank sampah, pyrolysis, and landfill tonnage.
- **FR-002:** Validate required location text and non-negative finite numeric inputs on the server.
- **FR-003:** Calculate results on the server using the existing model values and equations.
- **FR-004:** Keep 30% population adjustment, 0.19 ton/capita/year default, landfill constants, compost factors, GWP values, and open-burning ratio unchanged.
- **FR-005:** Do not infer emission credits for bank sampah or pyrolysis; disclose that these categories are not modeled in the source calculation.
- **FR-006:** Create a unique submission reference ID and persist summary and calculation-detail records separately.
- **FR-007:** Serialize writes with a script lock and report persistence failures as failures.
- **FR-008:** Return only the current submission's results; do not expose a public submission lookup endpoint.
- **FR-009:** Display the component breakdown, scenario comparison, calculation equations, parameters, citations, and reference quality status.
- **FR-010:** Provide a downloadable report with the submission reference and all available methodology/reference information.
- **FR-011:** Show informational warnings when scenario allocations exceed or fall short of estimated annual waste. Warnings do not alter the source calculation.
- **FR-012:** Mark missing bibliographic evidence as incomplete or needing validation; never fabricate page numbers, publication details, or URLs.

## Acceptance criteria
- A valid submission returns a unique reference ID and server-calculated result.
- Negative, non-finite, missing numeric values and blank/overlong location fields are rejected server-side.
- Known-answer tests cover population adjustment, annual waste, landfill, compost, open burning, totals, and negative reduction cases.
- Submissions and detail rows are linked by the same reference ID and do not overwrite one another under concurrent writes.
- A failed write is not presented as a successful submission.
- The report includes the input context, results, formulas, all parameter values, reference status, and known limitations.
- The interface clearly states that bank sampah and pyrolysis are not modeled for emissions/credits.
- No spreadsheet ID, private submission data, or credential is returned to the browser.
- Owner reviews the unresolved source citations and datastore setup before production deployment.

## Explicit non-goals
- No recalibration or methodological correction.
- No external research to complete missing citations.
- No public browsing of submissions, accounts, email delivery, or analytics dashboard.
- No production deployment or live data migration in this change.
