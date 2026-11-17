/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Preserved calculation logic transcribed from the existing Apps Script.
 */
var MODEL = {
  wasteGeneration: 0.19, migrationShare: 0.30,
  gwp: { co2: 1, ch4: 21, n2o: 310 },
  landfill: { DOC: 0.182, DOCf: 0.5, MCF: 0.8, F: 0.5, R: 0, OX: 0, ratio: 16 / 12 },
  compost: { ch4: 4.0, n2o: 0.3 },
  burning: { referenceTonnes: 328.78, referenceGgCO2e: 0.48766485 }
};

var REFERENCES = [
  { id:'REF-BPS-2006', title:'BPS (2006) — waste generation rate for small cities and rural areas',
    citation:'The source script cites BPS (2006) for 0.19 ton/capita/year. Full publication title, issuing unit, page and table were not supplied.',
    parameter:'Waste generation rate', value:'0.19', unit:'ton/kapita/year', location:'Page/table not specified',
    status:'incomplete', url:'', note:'Complete the bibliographic details from the original BPS publication.' },
  { id:'REF-IPCC-LANDFILL', title:'IPCC 2006 Guidelines, Volume 5, Chapter 3; KLHK Buku II',
    citation:'The source script cites IPCC 2006 Volume 5 for Tier 1 First Order Decay and KLHK Buku II for DOC = 0.182. Exact publication details and page/table were not supplied.',
    parameter:'DOC, DOCf, MCF, F, R, OX and 16/12', value:'0.182; 0.5; 0.8; 0.5; 0; 0; 16/12',
    unit:'dimensionless', location:'Volume 5, Chapter 3; exact page/table not specified',
    status:'incomplete', url:'', note:'DOC is attributed to KLHK Buku II; other constants are attributed generally to IPCC 2006.' },
  { id:'REF-IPCC-COMPOST', title:'IPCC 2006 Guidelines, Volume 5, Table 4.1',
    citation:'The source script cites Table 4.1 for 4 g CH4/kg and 0.3 g N2O/kg wet waste. Page and full bibliographic details were not supplied.',
    parameter:'Composting emission factors', value:'CH4 4.0; N2O 0.3', unit:'g gas/kg wet waste',
    location:'Volume 5, Table 4.1; page not specified', status:'incomplete', url:'',
    note:'The source script states that biogenic CO2 is treated as neutral.' },
  { id:'REF-GWP', title:'Global warming potential values in the existing script',
    citation:'The script uses CO2 = 1, CH4 = 21 and N2O = 310. It does not identify the assessment report, time horizon or table.',
    parameter:'Global warming potentials', value:'CO2 1; CH4 21; N2O 310', unit:'kg CO2e/kg gas',
    location:'Not specified', status:'needs validation', url:'',
    note:'Values are preserved exactly; they are not silently replaced with newer GWP values.' },
  { id:'REF-MIGRATION', title:'30% population adjustment — model assumption',
    citation:'The script deducts 30% of recorded population as daily commuters or residents working outside the village. No supporting study or official statistic is identified.',
    parameter:'Population migration adjustment', value:'30%', unit:'% of recorded population',
    location:'Not applicable', status:'needs validation', url:'',
    note:'This is an assumption in the existing model, not a verified scientific citation.' },
  { id:'REF-OPEN-BURNING', title:'Open-burning reference ratio embedded in the script',
    citation:'The script calculates (burned waste tonnes / 328.78) × 0.48766485 Gg CO2e. No source or derivation is recorded.',
    parameter:'Open-burning reference ratio', value:'328.78 tonnes → 0.48766485 Gg CO2e',
    unit:'Gg CO2e per reference quantity', location:'Not specified', status:'needs validation', url:'',
    note:'Preserved, but must not be represented as an independently verified emission factor.' }
];

function calculateWasteScenario(input) {
  var population = input.rw1 + input.rw2 + input.rw3 + input.rw4 + input.rw5 + input.rw6;
  var effectivePopulation = population * (1 - MODEL.migrationShare);
  var annualWasteTonnes = effectivePopulation * input.wasteGenerationRate;
  var landfillBase = calculateLandfill_(input.baselineLandfillTonnes);
  var landfillMiti = calculateLandfill_(input.mitigationLandfillTonnes);
  var burningGg = input.baselineOpenBurningTonnes > 0
    ? input.baselineOpenBurningTonnes / MODEL.burning.referenceTonnes * MODEL.burning.referenceGgCO2e : 0;
  // Source model sets baseline compost and mitigation open burning to zero.
  var compostBase = calculateComposting_(0);
  var compostMiti = calculateComposting_(input.mitigationCompostTonnes);
  var baseGg = landfillBase.co2eGg + burningGg + compostBase.co2eGg;
  var mitiGg = landfillMiti.co2eGg + compostMiti.co2eGg;
  var baseTonnes = baseGg * 1000;
  var mitiTonnes = mitiGg * 1000;
  var baselineAllocated = input.baselineOpenBurningTonnes + input.baselineLandfillTonnes;
  var mitigationAllocated = input.mitigationCompostTonnes + input.mitigationBankSampahTonnes +
    input.mitigationPyrolysisTonnes + input.mitigationLandfillTonnes;
  var warnings = [];
  if (baselineAllocated > annualWasteTonnes) warnings.push('Alokasi baseline melebihi estimasi timbulan tahunan. Hasil tetap dihitung sesuai rumus model.');
  if (mitigationAllocated > annualWasteTonnes) warnings.push('Alokasi mitigasi melebihi estimasi timbulan tahunan. Hasil tetap dihitung sesuai rumus model.');
  if (mitigationAllocated < annualWasteTonnes) warnings.push('Sebagian timbulan belum dialokasikan pada skenario mitigasi. Selisih tidak otomatis dihitung sebagai emisi.');
  warnings.push('Bank sampah 3R dan pirolisis dicatat sebagai alokasi massa, tetapi emisi dan kredit penghindarannya bernilai 0 pada model sumber.');
  warnings.push('Emisi pembakaran terbuka memakai rasio tetap yang asal-usulnya belum terdokumentasi.');
  return {
    location:{village:input.village,subdistrict:input.subdistrict,regency:input.regency},
    population:{recorded:population,adjustmentRate:MODEL.migrationShare,effective:effectivePopulation},
    waste:{generationRate:input.wasteGenerationRate,annualEstimatedTonnes:annualWasteTonnes,
      baselineAllocatedTonnes:baselineAllocated,mitigationAllocatedTonnes:mitigationAllocated,
      baselineBalanceTonnes:annualWasteTonnes-baselineAllocated,mitigationBalanceTonnes:annualWasteTonnes-mitigationAllocated},
    inputs:input,
    emissions:{
      baseline:{landfillTonnesCO2e:landfillBase.co2eGg*1000,openBurningTonnesCO2e:burningGg*1000,
        compostTonnesCO2e:compostBase.co2eGg*1000,totalTonnesCO2e:baseTonnes},
      mitigation:{landfillTonnesCO2e:landfillMiti.co2eGg*1000,openBurningTonnesCO2e:0,
        compostTonnesCO2e:compostMiti.co2eGg*1000,bankSampahTonnesCO2e:0,pyrolysisTonnesCO2e:0,totalTonnesCO2e:mitiTonnes},
      reductionTonnesCO2e:baseTonnes-mitiTonnes,
      reductionPercent:baseTonnes>0?(baseTonnes-mitiTonnes)/baseTonnes*100:0
    },
    calculation:{landfillBaseline:landfillBase,landfillMitigation:landfillMiti,
      compostBaseline:compostBase,compostMitigation:compostMiti,openBurningBaselineGg:burningGg},
    warnings:warnings
  };
}

function calculateLandfill_(wasteTonnes) {
  var wasteGg = wasteTonnes / 1000;
  var ddocm = wasteGg * MODEL.landfill.DOC * MODEL.landfill.DOCf * MODEL.landfill.MCF;
  var lo = ddocm * MODEL.landfill.F * MODEL.landfill.ratio;
  var ch4 = (lo - MODEL.landfill.R) * (1 - MODEL.landfill.OX);
  return {wasteGg:wasteGg,ddocmGg:ddocm,methaneGeneratedGg:lo,methaneEmittedGg:ch4,co2eGg:ch4*MODEL.gwp.ch4};
}

function calculateComposting_(wasteTonnes) {
  var kg = wasteTonnes * 1000;
  var ch4Gg = kg * MODEL.compost.ch4 / 1000000000;
  var n2oGg = kg * MODEL.compost.n2o / 1000000000;
  return {wasteKg:kg,methaneGg:ch4Gg,nitrousOxideGg:n2oGg,co2eGg:ch4Gg*MODEL.gwp.ch4+n2oGg*MODEL.gwp.n2o};
}

function getModelReferences() { return REFERENCES; }
