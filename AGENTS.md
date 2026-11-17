# Repository working agreements

## Calculation source of truth
- Treat `Skenario Mitigasi Limbah.xlsx` and its current formulas as the calculation baseline.
- Do not change formulas, factors, units, boundaries, defaults, or methodology without explicit owner approval.
- Separate software defects from methodological concerns; record workbook cells and evidence.
- Do not add credentials, secrets, personal data, or private submissions.

## Product scope
- The public app is Streamlit.
- No end-user account, database, central submission storage, or submission history.
- Users can download their own result.
- Avoid speculative abstractions, unnecessary dependencies, and features outside the MVP.

## Verification
- Keep calculation logic independent from Streamlit UI code.
- Add regression tests for workbook-known outputs and invalid/boundary inputs.
- Run tests and report exact evidence; do not claim deployment unless verified.
- Do not deploy or change production configuration without owner approval.
