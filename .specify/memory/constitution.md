# Mitigasi Sampah — Project Constitution

## 1. Preserve the calculation contract
The source workbook and current formulas define the calculation baseline. Preserve formulas, factors, assumptions, units, boundaries, and rounding unless the owner explicitly approves a change. Record suspected defects separately with reproducible evidence.

## 2. Privacy by design
The public app does not store submissions centrally. Never commit credentials, secrets, personal data, or private operational records. The source workbook may be public only by owner intent.

## 3. Calculation authority
The Python calculation module is the sole runtime calculation implementation. The browser/UI must not supply calculated totals. Keep calculation logic independent of Streamlit presentation.

## 4. No central submission storage
The MVP has no user accounts, database, submission history, or central persistence. Users download their own result.

## 5. Simplicity over machinery
Prefer the smallest design that meets approved requirements. Avoid unnecessary frameworks, dependencies, layers, abstractions, and features.

## 6. Accessibility and usability
The public interface should work on common mobile and desktop browsers, explain inputs and units, and communicate validation clearly.

## 7. Specification before material changes
Keep specification, plan, tasks, and acceptance criteria aligned with the implemented product direction.

## 8. Evidence-based completion
Inspect before changing. Test behavior, inspect failures, and report exact evidence. Never imply deployment or production readiness without verification.

## 9. Owner approval for consequential changes
Obtain explicit approval before changing calculation methodology or deploying to a live production environment.
