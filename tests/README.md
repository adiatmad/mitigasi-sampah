# Tests

Run deterministic calculation-model tests with Node.js:

```sh
node --test tests/calculator.test.js
```

The suite checks population adjustment, annual waste, landfill emissions, composting emissions, open-burning ratio, unmodeled bank-sampah/pyrolysis behavior, and negative reduction cases.

These tests exercise the pure calculation module only. They do not simulate Apps Script services, spreadsheet permissions, deployment identity, persistence rollback, or concurrent Google Sheets writes. Those checks must be run in a test Apps Script project.
