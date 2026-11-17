/**
 * Mitigasi Sampah — Google Apps Script server entry point.
 *
 * Implementation intentionally deferred until the source workbook is audited
 * and the feature specification is approved.
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Mitigasi Sampah');
}
