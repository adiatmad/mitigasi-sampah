# Mitigasi Sampah

A public-facing carbon calculator for waste-management scenarios, built with Google Apps Script and a private Google Sheets data store.

> **Project status: preparation only.** The existing workbook and calculation logic have not yet been audited. No production calculations or deployment configuration are implemented in this repository.

## Product direction

- Public web application; end users do not need a Google account.
- Private, centrally managed Google Sheets database.
- Separate sheets for submission records and calculation-detail records.
- Results displayed to the submitting user after a successful submission.
- Downloadable report and unique submission reference ID.
- Existing formulas, emission factors, assumptions, and methodology must be preserved. Potential issues are documented separately and require owner approval before any methodological change.

## Repository layout

```text
.specify/
  memory/constitution.md
specs/
  001-public-carbon-calculator/
    spec.md
    plan.md
    tasks.md
    checklists/requirements.md
src/
  Code.gs
  Index.html
  Styles.html
  appsscript.json
tests/
  README.md
.claspignore
.clasp.json.example
.gitignore
AGENTS.md
LICENSE
README.md
```

## Source of truth and data safety

- This repository is the source of truth for application code and project specifications.
- The operational Google Spreadsheet must remain private. Do not commit its ID, credentials, access tokens, or private user submissions.
- **Do not upload the original Excel workbook to this public repository yet.** A public repository makes uploaded files publicly accessible, and the repository's MIT license would apply to repository contents. First confirm that the workbook contains no personal data, confidential records, restricted third-party material, or content you do not intend to publish. Prefer sharing the workbook through a private channel for the initial audit.
- Never place real `.clasp.json` files or secrets in Git. Use `.clasp.json.example` as a template only.

## Development status

The initial repository scaffold is documentation and empty application placeholders only. Implementation starts after the source workbook has been reviewed and the specification and acceptance criteria have been approved.

Planned implementation sequence:

1. Audit the workbook structure, formulas, named ranges, and dependencies.
2. Record the existing calculation behavior as characterization cases.
3. Finalize the feature specification, technical plan, and acceptance criteria.
4. Implement the smallest maintainable Apps Script web application.
5. Verify calculation parity, validation, concurrent submissions, privacy boundaries, and report generation.
6. Deploy only after the owner has reviewed and approved the release.

## Google Apps Script setup

The Apps Script project source is in `src/`. When configuring `clasp`, use that directory as the project root and keep the real `.clasp.json` local and untracked.

1. Install and authenticate the Google clasp CLI.
2. Copy `.clasp.json.example` to `.clasp.json`.
3. Replace the placeholder script ID with the Apps Script project ID you control.
4. From the repository root, run `clasp push` only after reviewing the files and confirming the target project.

No script ID, spreadsheet ID, or deployment URL is included in this repository.

## License

The application source and original project documentation are licensed under the MIT License. See [LICENSE](LICENSE). This does not grant rights to third-party material, trademarks, personal data, or content that the project owner does not own or have permission to publish.
