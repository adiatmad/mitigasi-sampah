# Feature Specification: Public Waste-Management Carbon Calculator

**Status:** MVP implemented on `feat/streamlit-carbon-calculator`; workbook parity characterized for its saved Kaliwlingi example. Methodology review remains open.

## Confirmed product decisions
- Public-facing Streamlit application; no end-user login.
- No database, central submission storage, or submission history.
- Users can download their own calculation result.
- Workbook formulas, constants, assumptions, units, boundaries, and current behavior are preserved until owner approval changes them.

## In scope
- Enter total population (equivalent to the sum of the workbook's six RW population cells).
- Calculate the workbook's baseline and fixed mitigation scenarios.
- Display annual emissions, reduction, waste composition, and scenario allocations.
- Download result data as JSON.
- Show workbook-derived assumptions, source references, and limitations.

## Out of scope
- Arbitrary user-defined waste allocation scenarios.
- Accounts, database, central persistence, submission IDs, or public result browsing.
- Independent recalibration of emission factors or methodology.
- Regulatory certification or measured-emissions claims.

## Functional requirements
- **FR-001:** Accept non-negative population and reject malformed values.
- **FR-002:** Reproduce workbook formulas and fixed assumptions, including current inconsistencies, until explicitly approved otherwise.
- **FR-003:** Calculate server-side; do not accept client-supplied totals.
- **FR-004:** Display baseline, mitigation, and estimated reduction in tCO2e.
- **FR-005:** Show waste allocations and composition values used.
- **FR-006:** Allow downloading calculation details without storing submissions centrally.
- **FR-007:** Disclose that results are estimates from a fixed workbook scenario, not measured emissions.
- **FR-008:** Distinguish references transcribed from the workbook from independently validated sources.

## Acceptance criteria
- [x] Population 10,539 reproduces workbook cached outputs: baseline 1,581.1719697799867 tCO2e; mitigation 344.99200703436014 tCO2e; reduction 1,236.1799627456267 tCO2e (floating-point tolerance).
- [x] Zero population produces zero emissions.
- [x] Negative, boolean, non-numeric, infinite, and NaN inputs are rejected by calculation function.
- [x] Baseline and mitigation waste allocations each sum to total annual waste.
- [x] No database, authentication, or server-side submission persistence.
- [x] JSON download includes results, model version, references, and limitations.
- [ ] Streamlit Cloud deployment and live-browser smoke test (owner action).
- [ ] Independent methodology/source validation (separate review; no behavior change without approval).
