# Calculation model and reference register

## Source and preservation boundary

The public calculator reproduces the parameter values and equations found in the existing Apps Script implementation captured in the project working materials. It does not claim that the scientific validity of those parameters has been independently verified. No external source research was used for this implementation.

The model is intentionally kept as it exists in the source implementation. Potential methodological issues are disclosed below and are not silently corrected.

## Inputs and calculations

| Input / parameter | Existing value or behavior | Unit | Source/status |
|---|---:|---|---|
| Population | Sum of RW 01–06 | people | User input |
| Population adjustment | 30% deducted | % | Model assumption; needs validation |
| Effective population | Recorded population × (1 − 0.30) | people | Existing script |
| Waste generation | 0.19 | ton/capita/year | BPS (2006) cited in script; bibliographic details incomplete |
| Baseline open burning | User input | ton/year | User input |
| Baseline landfill / unmanaged disposal | User input | ton/year | User input |
| Mitigation composting | User input | ton/year | User input |
| Mitigation bank sampah 3R | User input | ton/year | User input; no emissions calculated in source model |
| Mitigation pyrolysis | User input | ton/year | User input; no emissions calculated in source model |
| Mitigation landfill | User input | ton/year | User input |

### Landfill

The source script implements:

- Waste converted from tonnes to Gg: (W_{Gg}=W_{tonnes}/1000).
- Decomposable organic carbon: (DDOC_m=W_{Gg}\times DOC\times DOC_f\times MCF).
- Methane generated: (L_o=DDOC_m\times F\times 16/12).
- Methane emitted: (CH_4=(L_o-R)\times(1-OX)).
- Carbon dioxide equivalent: (CO_2e_{Gg}=CH_4\times GWP_{CH_4}).
- Convert Gg CO2e to tonnes CO2e by multiplying by 1,000.

| Parameter | Value | Unit | Source recorded in script | Status |
|---|---:|---|---|---|
| DOC | 0.182 | fraction | KLHK Buku II | Incomplete |
| DOCf | 0.5 | fraction | IPCC 2006 Vol. 5, Ch. 3 (general citation) | Incomplete |
| MCF | 0.8 | fraction | IPCC 2006 Vol. 5, Ch. 3 (general citation) | Incomplete |
| F | 0.5 | fraction | IPCC 2006 Vol. 5, Ch. 3 (general citation) | Incomplete |
| R | 0.0 | Gg CH4 | Existing script | Incomplete |
| OX | 0.0 | fraction | Existing script | Incomplete |
| 16/12 | 16/12 | molecular-weight ratio | Existing equation | Incomplete |
| GWP CH4 | 21 | kg CO2e/kg CH4 | No assessment report/table identified | Needs validation |

The source code labels the method as IPCC 2006 Tier 1 First Order Decay. The public interface shows the equation and parameter values, but does not imply that a complete FOD time-series model has been implemented.

### Composting

The source script implements:

- (CH_4(Gg)=kg\ wet\ waste\times4.0/10^9).
- (N_2O(Gg)=kg\ wet\ waste\times0.3/10^9).
- (CO_2e(Gg)=CH_4\times21+N_2O\times310).
- Baseline compost input is fixed at zero by the source input flow; mitigation compost uses the user input.
- The source script treats biogenic CO2 as neutral.

| Parameter | Value | Unit | Source recorded in script | Status |
|---|---:|---|---|---|
| CH4 factor | 4.0 | g CH4/kg wet waste | IPCC 2006 Vol. 5, Table 4.1 | Incomplete |
| N2O factor | 0.3 | g N2O/kg wet waste | IPCC 2006 Vol. 5, Table 4.1 | Incomplete |
| GWP CH4 | 21 | kg CO2e/kg CH4 | No assessment report/table identified | Needs validation |
| GWP N2O | 310 | kg CO2e/kg N2O | No assessment report/table identified | Needs validation |

### Open burning

The source script implements:

[
CO_2e(Gg)=\frac{W_{burned}(tonnes)}{328.78}\times0.48766485
]

This coefficient is retained exactly. Its original source, derivation, gas coverage, and activity-data basis are not recorded. It is therefore marked **needs validation**, not as a verified emission factor.

### Scenario totals

- Baseline = landfill emissions + open-burning emissions + baseline compost emissions (fixed at zero).
- Mitigation = landfill emissions + mitigation compost emissions.
- Mitigation open burning is fixed at zero.
- Bank sampah 3R and pyrolysis mass are recorded but their emissions and avoided-emission credits are zero in the source model.
- Reduction = baseline emissions − mitigation emissions.
- Reduction (%) = reduction ÷ baseline emissions × 100, when baseline emissions are greater than zero.

The application warns when scenario allocations exceed or fall short of estimated annual waste. These warnings do not alter the calculation or block submission.

## Reference register

| ID | Reference / basis | Parameter(s) | Status | Missing evidence |
|---|---|---|---|---|
| REF-BPS-2006 | BPS (2006), as cited in source script | 0.19 ton/capita/year | Incomplete | Full title, issuing unit, page/table, URL |
| REF-IPCC-LANDFILL | IPCC 2006 Guidelines, Vol. 5, Ch. 3; KLHK Buku II | DOC, DOCf, MCF, F, R, OX, 16/12 | Incomplete | Full KLHK citation; exact IPCC page/table and edition |
| REF-IPCC-COMPOST | IPCC 2006 Guidelines, Vol. 5, Table 4.1 | 4.0 g CH4/kg; 0.3 g N2O/kg wet waste | Incomplete | Exact page and full bibliographic record |
| REF-GWP | Values embedded in existing script | CO2 1; CH4 21; N2O 310 | Needs validation | Assessment report, time horizon, table |
| REF-MIGRATION | Existing model assumption | 30% population adjustment | Needs validation | Local study or official statistic supporting 30% |
| REF-OPEN-BURNING | Existing script ratio | 328.78 tonnes → 0.48766485 Gg CO2e | Needs validation | Original source, derivation, and activity-data basis |

No DOI, page number, publication title, or source URL is fabricated. Clickable source links can be added when the original source documents or exact URLs are supplied.

## Known limitations retained from the source model

1. The 30% population deduction is an assumption, not a cited local statistic.
2. The open-burning coefficient is opaque and not independently traceable.
3. The GWP values are retained exactly as coded; their assessment basis is not identified.
4. Bank sampah 3R and pyrolysis do not contribute emissions or avoided-emission credits in the current model.
5. The annual waste estimate is not used to automatically derive the scenario allocations. Allocations are accepted as entered; mismatch warnings are informational.
6. The source's landfill equation is preserved as implemented. This web implementation does not add time-dependent FOD decay, oxidation/recovery assumptions, or other methodological refinements.
