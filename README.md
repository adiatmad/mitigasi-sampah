# Kalkulator Mitigasi Sampah

A public Streamlit application that ports the current calculation behavior of `Skenario Mitigasi Limbah.xlsx` into Python. Users enter a population total and can download their own result as JSON. No login, database, central submission storage, or submission history.

## Run locally

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

## Deploy on Streamlit Community Cloud

1. Push/merge the reviewed code to a GitHub branch.
2. Sign in to Streamlit Community Cloud and choose **Create app**.
3. Select this repository and branch; set the main file path to `app.py`.
4. Deploy. No secrets or database configuration are required.

## Calculation fidelity

- `calculator.py` mirrors the workbook's current formulas and fixed assumptions.
- The app asks for total population because the workbook only uses the sum of its six RW population cells; their distribution does not affect results.
- Composition percentages, 30% out-migration, 0.19 tonnes/person/year, scenario allocations, emission factors, and GWP values remain fixed as in the workbook.
- The saved Kaliwlingi example (population 10,539) is the known-answer regression case in `tests/test_calculator.py`.
- Suspected methodology issues are disclosed separately; they are not silently corrected.

## Important limitation

This is a calculation port, not an independent validation of the workbook's methodology or sources. The mitigation scenario is fixed; users cannot design arbitrary waste-management mixes. Bank sampah 3R, biodigester, and pyrolysis allocations do not receive modeled avoided-emission credits in the current workbook. Do not present the result as measured or guaranteed real-world reduction.

## Tests

```bash
pip install pytest
pytest -q
```

The original workbook is the calculation source of truth but is not required at runtime.
