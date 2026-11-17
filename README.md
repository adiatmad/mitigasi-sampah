# Mitigasi Sampah

A public-facing waste-management emissions calculator built with Google Apps Script and a private Google Sheets datastore.

## What is implemented
- Public Indonesian-language calculator interface.
- Server-side input validation and calculation.
- Private submission and calculation-detail sheets.
- Unique submission reference IDs.
- Result breakdown and downloadable HTML report.
- Visible calculation equations, parameter values, source notes, and reference-quality statuses.

## Calculation fidelity and limitations
The application preserves the values and formulas from the existing Apps Script model. It does not claim independent scientific validation. See [calculation model and reference register](docs/methodology-and-references.md).

In particular, the source model:
- deducts 30% of recorded population;
- uses 0.19 ton/capita/year as the default waste-generation rate;
- uses GWP values CH4 = 21 and N2O = 310;
- uses an open-burning ratio whose derivation is not documented;
- records bank sampah and pyrolysis tonnage but calculates neither their emissions nor avoided-emission credits.

These are deliberately disclosed rather than silently corrected.

## Files
- `src/Code.gs`: web entry point, validation, persistence and submission handling.
- `src/Calculator.gs`: calculation model and reference register.
- `src/Index.html`: public calculator, results, methodology and downloadable report.
- `src/Styles.html`: responsive styles.
- `src/appsscript.json`: Apps Script runtime and scopes.

## Setup
1. Create or open the Apps Script project you control.
2. Copy all files from `src/` into the Apps Script project, preserving filenames (create `Calculator.gs` as a new script file).
3. In the Apps Script editor, select and run `setupDataStore()` once. Review and authorize the requested Google Sheets access.
4. The function creates a private spreadsheet named `Mitigasi Sampah — Private Submissions`, stores its ID in Script Properties, and returns its URL. Keep this spreadsheet private.
5. Deploy as a web app. For the intended public workflow, set **Execute as: Me** (the owner who created the private datastore) and **Who has access: Anyone**, if that option is available for your Google Workspace/account. Public users should not receive direct access to the spreadsheet.
6. Test one submission and inspect the private `Submissions` and `CalculationDetails` sheets before sharing the URL.
7. Treat the first deployment as a restricted test. Anonymous rate limiting/CAPTCHA, retention policy, and operational monitoring are not implemented; do not publish widely until you have decided how to manage spam, quota consumption, and stored submission data.

The app does not auto-create the datastore during a public request. If setup has not been run, submissions fail with an explicit setup message.

## Verification
Run the local calculation tests with Node.js:

```sh
node --test tests/calculator.test.js
```

The test suite is a deterministic unit test of the pure calculation model. It does not simulate Google Apps Script services, deployment permissions, or concurrent Sheets writes. Those require a test deployment in the user's Apps Script project.

## Safety
Never commit real `.clasp.json` credentials, spreadsheet IDs, private submissions, or confidential data. Do not deploy or replace a live project until the owner has reviewed the files and tested a deployment.
