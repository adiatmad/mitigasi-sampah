/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Public web entry point and private persistence layer.
 */
var DATA_STORE_PROPERTY = 'DATA_SPREADSHEET_ID';
var SUBMISSIONS_SHEET = 'Submissions';
var DETAILS_SHEET = 'CalculationDetails';

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Kalkulator Mitigasi Sampah')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}
function include(filename) { return HtmlService.createHtmlOutputFromFile(filename).getContent(); }
function getPublicConfig() {
  return {dataStoreReady:Boolean(PropertiesService.getScriptProperties().getProperty(DATA_STORE_PROPERTY)),references:getModelReferences()};
}

/** Run once manually from the Apps Script editor. Creates a private datastore. */
function setupDataStore() {
  var props=PropertiesService.getScriptProperties();
  var id=props.getProperty(DATA_STORE_PROPERTY);
  var ss=id?SpreadsheetApp.openById(id):SpreadsheetApp.create('Mitigasi Sampah — Private Submissions');
  props.setProperty(DATA_STORE_PROPERTY,ss.getId());
  ensureDataSheets_(ss);
  return {spreadsheetName:ss.getName(),spreadsheetUrl:ss.getUrl(),message:'Data store siap. Simpan spreadsheet ini secara privat.'};
}

function submitCalculation(payload) {
  var input=validateSubmission_(payload);
  var result=calculateWasteScenario(input);
  var ref='MS-'+Utilities.getUuid().replace(/-/g,'').substring(0,12).toUpperCase();
  var now=new Date();
  var ss=getDataSpreadsheet_();
  var lock=LockService.getScriptLock();
  lock.waitLock(30000);
  var submissionRow=0, detailStart=0;
  try {
    var sheets=ensureDataSheets_(ss);
    var summary=[ref,now,input.village,input.subdistrict,input.regency,
      result.population.recorded,result.population.effective,result.waste.annualEstimatedTonnes,
      result.emissions.baseline.totalTonnesCO2e,result.emissions.mitigation.totalTonnesCO2e,
      result.emissions.reductionTonnesCO2e,result.emissions.reductionPercent,JSON.stringify(input),JSON.stringify(result)];
    submissionRow=sheets.submissions.getLastRow()+1;
    sheets.submissions.getRange(submissionRow,1,1,summary.length).setValues([summary]);
    var details=buildDetailRows_(ref,input,result);
    detailStart=sheets.details.getLastRow()+1;
    sheets.details.getRange(detailStart,1,details.length,details[0].length).setValues(details);
    SpreadsheetApp.flush();
  } catch(err) {
    try {
      var rollback=ensureDataSheets_(ss);
      if(detailStart && rollback.details.getLastRow()>=detailStart)
        rollback.details.deleteRows(detailStart,rollback.details.getLastRow()-detailStart+1);
      if(submissionRow && rollback.submissions.getLastRow()>=submissionRow)
        rollback.submissions.deleteRow(submissionRow);
    } catch(rollbackErr) { console.error('Rollback failed: '+rollbackErr.message); }
    throw new Error('Submission gagal disimpan. Hasil belum dikonfirmasi. '+err.message);
  } finally { lock.releaseLock(); }
  return {referenceId:ref,submittedAt:now.toISOString(),result:result,references:getModelReferences()};
}

function validateSubmission_(p) {
  if(!p || typeof p!=='object') throw new Error('Data input tidak valid.');
  ['village','subdistrict','regency'].forEach(function(k) {
    if(typeof p[k]!=='string' || !p[k].trim() || p[k].trim().length>100)
      throw new Error('Isi '+k+' dengan teks maksimal 100 karakter.');
  });
  var fields=['rw1','rw2','rw3','rw4','rw5','rw6','wasteGenerationRate','baselineOpenBurningTonnes',
    'baselineLandfillTonnes','mitigationCompostTonnes','mitigationBankSampahTonnes',
    'mitigationPyrolysisTonnes','mitigationLandfillTonnes'];
  var values={};
  fields.forEach(function(k) {
    var n=Number(p[k]);
    if(p[k]==='' || p[k]===null || p[k]===undefined || !isFinite(n) || n<0)
      throw new Error('Nilai '+k+' harus berupa angka nol atau lebih.');
    values[k]=n;
  });
  if(values.wasteGenerationRate<=0) throw new Error('Laju timbulan harus lebih besar dari nol.');
  return {village:p.village.trim(),subdistrict:p.subdistrict.trim(),regency:p.regency.trim(),
    rw1:values.rw1,rw2:values.rw2,rw3:values.rw3,rw4:values.rw4,rw5:values.rw5,rw6:values.rw6,
    wasteGenerationRate:values.wasteGenerationRate,baselineOpenBurningTonnes:values.baselineOpenBurningTonnes,
    baselineLandfillTonnes:values.baselineLandfillTonnes,mitigationCompostTonnes:values.mitigationCompostTonnes,
    mitigationBankSampahTonnes:values.mitigationBankSampahTonnes,mitigationPyrolysisTonnes:values.mitigationPyrolysisTonnes,
    mitigationLandfillTonnes:values.mitigationLandfillTonnes};
}
function getDataSpreadsheet_() {
  var id=PropertiesService.getScriptProperties().getProperty(DATA_STORE_PROPERTY);
  if(!id) throw new Error('Data store belum disiapkan. Jalankan setupDataStore() satu kali dari editor Apps Script.');
  return SpreadsheetApp.openById(id);
}
function ensureDataSheets_(ss) {
  var sub=ss.getSheetByName(SUBMISSIONS_SHEET)||ss.insertSheet(SUBMISSIONS_SHEET);
  var det=ss.getSheetByName(DETAILS_SHEET)||ss.insertSheet(DETAILS_SHEET);
  var sh=['reference_id','submitted_at','village','subdistrict','regency','population_recorded','population_effective',
    'annual_waste_tonnes','baseline_tonnes_co2e','mitigation_tonnes_co2e','reduction_tonnes_co2e','reduction_percent','input_json','result_json'];
  var dh=['reference_id','group','item','value','unit','formula_or_definition','source_id','source_status'];
  if(!sub.getLastRow()){sub.getRange(1,1,1,sh.length).setValues([sh]);sub.setFrozenRows(1);}
  if(!det.getLastRow()){det.getRange(1,1,1,dh.length).setValues([dh]);det.setFrozenRows(1);}
  return {submissions:sub,details:det};
}
function buildDetailRows_(ref,input,result) {
  var rows=[];
  function add(group,item,value,unit,formula,source) {
    var match=getModelReferences().filter(function(r){return r.id===source;})[0];
    rows.push([ref,group,item,value,unit,formula,source||'',match?match.status:'not applicable']);
  }
  Object.keys(input).forEach(function(k) {
    add('input',k,input[k],k.indexOf('Tonnes')>=0?'ton/tahun':(k.indexOf('rw')===0?'jiwa':''),
      'Input pengguna',k==='wasteGenerationRate'?'REF-BPS-2006':'');
  });
  add('population','Populasi tercatat',result.population.recorded,'jiwa','Jumlah RW 01–06','');
  add('population','Populasi efektif',result.population.effective,'jiwa','Populasi tercatat × (1 − 0,30)','REF-MIGRATION');
  add('waste','Estimasi timbulan tahunan',result.waste.annualEstimatedTonnes,'ton/tahun','Populasi efektif × laju timbulan','REF-BPS-2006');
  add('result','Emisi baseline',result.emissions.baseline.totalTonnesCO2e,'ton CO2e/tahun','TPA + pembakaran + kompos','');
  add('result','Emisi mitigasi',result.emissions.mitigation.totalTonnesCO2e,'ton CO2e/tahun','TPA + kompos; bank sampah/pirolisis bernilai 0 pada model sumber','');
  add('result','Penurunan emisi',result.emissions.reductionTonnesCO2e,'ton CO2e/tahun','Baseline − mitigasi','');
  add('result','Persentase penurunan',result.emissions.reductionPercent,'%','Penurunan ÷ baseline × 100%','');
  return rows;
}
