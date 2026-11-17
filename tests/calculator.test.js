const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../src/Calculator.gs'), 'utf8');
const context = {};
vm.runInNewContext(source, context);
function input(overrides = {}) {
  return Object.assign({
    village:'Contoh',subdistrict:'Kecamatan Contoh',regency:'Kabupaten Contoh',
    rw1:1000,rw2:0,rw3:0,rw4:0,rw5:0,rw6:0,wasteGenerationRate:0.19,
    baselineOpenBurningTonnes:328.78,baselineLandfillTonnes:1000,
    mitigationCompostTonnes:100,mitigationBankSampahTonnes:50,
    mitigationPyrolysisTonnes:25,mitigationLandfillTonnes:1000
  },overrides);
}
test('population adjustment and annual waste preserve source constants',()=>{
  const r=context.calculateWasteScenario(input());
  assert.equal(r.population.recorded,1000);assert.equal(r.population.effective,700);
  assert.equal(r.waste.annualEstimatedTonnes,133);
});
test('landfill calculation preserves source constants and GWP',()=>{
  const r=context.calculateWasteScenario(input({baselineOpenBurningTonnes:0}));
  assert.ok(Math.abs(r.emissions.baseline.landfillTonnesCO2e-1019.2)<1e-9);
});
test('composting preserves 4.0 and 0.3 g/kg factors and GWP',()=>{
  const r=context.calculateWasteScenario(input({baselineOpenBurningTonnes:0,baselineLandfillTonnes:0}));
  assert.ok(Math.abs(r.emissions.mitigation.compostTonnesCO2e-17.7)<1e-9);
});
test('open-burning reference ratio is reproduced exactly',()=>{
  const r=context.calculateWasteScenario(input({baselineLandfillTonnes:0}));
  assert.ok(Math.abs(r.emissions.baseline.openBurningTonnesCO2e-487.66485)<1e-8);
});
test('bank sampah and pyrolysis are recorded but do not affect emissions',()=>{
  const a=context.calculateWasteScenario(input({mitigationBankSampahTonnes:0,mitigationPyrolysisTonnes:0}));
  const b=context.calculateWasteScenario(input({mitigationBankSampahTonnes:500,mitigationPyrolysisTonnes:700}));
  assert.equal(a.emissions.mitigation.totalTonnesCO2e,b.emissions.mitigation.totalTonnesCO2e);
  assert.equal(b.emissions.mitigation.bankSampahTonnesCO2e,0);assert.equal(b.emissions.mitigation.pyrolysisTonnesCO2e,0);
});
test('reduction can be negative when mitigation emissions exceed baseline',()=>{
  const r=context.calculateWasteScenario(input({baselineOpenBurningTonnes:0,baselineLandfillTonnes:0,
    mitigationCompostTonnes:0,mitigationLandfillTonnes:100}));
  assert.ok(r.emissions.reductionTonnesCO2e<0);assert.ok(r.emissions.reductionPercent<0);
});
