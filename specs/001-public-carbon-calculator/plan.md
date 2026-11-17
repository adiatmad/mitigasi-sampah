# Implementation Plan: Streamlit Carbon Calculator

**Status:** MVP implementation prepared on `feat/streamlit-carbon-calculator`.

## Architecture
- `app.py`: Streamlit UI, input validation, result display, JSON download.
- `calculator.py`: pure Python port of workbook calculation behavior.
- `references.py`: workbook-cited references, model version, and disclosed limitations.
- `tests/test_calculator.py`: known-answer, validation, and allocation-conservation tests.

No database, account system, server-side submission storage, secrets, or external API is required.

## Fidelity strategy
1. Treat workbook formulas and cached example as behavior baseline.
2. Port formulas directly, preserving units and inconsistencies rather than silently correcting them.
3. Verify the saved Kaliwlingi example and add edge/contract tests.
4. Record methodology concerns separately from software correctness.
5. Seek owner approval before any methodology change.

## Deployment
Streamlit Community Cloud can deploy the repository root with `app.py` as the main file. Dependencies are declared in `requirements.txt`; no secrets are needed. Deployment is not performed by this change.

## Known limits
- Scenario allocations are fixed; users cannot model custom local waste mixes.
- Six RW population cells are collapsed into one total because only their sum affects formulas.
- The saved workbook example is the primary known-answer case; additional independent cases should be added when available.
- Tests validate the Python port against cached workbook outputs, not the scientific validity of the methodology.
