MODEL_VERSION = "workbook-faithful-2026-11-17"
WORKBOOK_NAME = "Skenario Mitigasi Limbah.xlsx"
REFERENCES = [
 {"topic":"DOC","source":"Buku II Volume 4 – Pengelolaan Limbah, KLH","cells":"Estimasi Emisi!N37; DOC!E13","value":"0.182 Gg C/Gg waste"},
 {"topic":"DOCf","source":"2006 IPCC Guidelines, Volume 5: Waste","cells":"Estimasi Emisi!N38; workbook page 3.13","value":"0.5"},
 {"topic":"MCF","source":"2006 IPCC Guidelines, Volume 5: Waste","cells":"Estimasi Emisi!N39; workbook page 3.14","value":"0.8"},
 {"topic":"F","source":"2006 IPCC Guidelines, Volume 5: Waste","cells":"Estimasi Emisi!N40; workbook page 3.15","value":"0.5"},
 {"topic":"R / OX","source":"2006 IPCC Guidelines, Volume 5: Waste","cells":"Estimasi Emisi!N41:N42","value":"0 / 0"},
 {"topic":"GWP","source":"Workbook GWP table","cells":"Estimasi Emisi!I49:I51","value":"CO2=1; CH4=21; N2O=310"},
 {"topic":"Composting","source":"Arnold (2005); Beck-Friis (2002); Detzel et al. (2003); Petersen et al. (1998); Hellebrand (1998); Hogg (2002); Vesterinen (1996)","cells":"Estimasi Emisi!O62:T70","value":"CH4 4 g/kg dry; N2O 0.3 g/kg wet; moisture assumption 60%"},
 {"topic":"Open burning","source":"Three 4C2 open-burning worksheets","cells":"CO2!I14:I24; CH4!B11:D11; N2O!B11:D11","value":"CH4 6500 g/t wet; N2O 150 kg/Gg dry (linked mass reused)"},
]
LIMITATIONS = [
 "30% out-migration and 0.19 tonnes/person/year are fixed assumptions without a supporting citation beside those cells.",
 "Composition percentages and scenario allocations are fixed workbook values, not user-entered measurements.",
 "Bank sampah 3R, biodigester and pyrolysis have no modeled emissions or avoided-emission credits in the current workbook.",
 "The N2O open-burning sheet labels mass as dry weight but links the same amount as the wet-weight CH4 sheet; reproduced as written.",
 "Composting formulas combine dry- and wet-basis factors as written; no extra 60% moisture conversion is applied in the formula cells.",
 "GWP values are CH4=21 and N2O=310; the workbook does not specify assessment report or time horizon beside them.",
]
