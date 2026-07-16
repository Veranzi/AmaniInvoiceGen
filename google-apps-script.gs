// Paste this into Extensions > Apps Script on the Google Sheet you'll use as the
// invoice log, then deploy as a Web App. See README.md "Audit & analysis" section.

var SHEET_NAME = 'Invoices';
var INVOICE_NUMBER_COL = 2; // column B (1-indexed): Timestamp is column A

var HEADERS = [
  'Timestamp', 'InvoiceNumber', 'InvoiceDate', 'BusinessName', 'Address', 'AddressLine2',
  'PhoneEmail', 'GuestName', 'GuestAddress1', 'GuestAddress2', 'GuestContact',
  'ReservationNumber', 'CheckIn', 'CheckOut', 'Nights', 'Currency', 'Subtotal', 'TaxRate',
  'TaxAmount', 'TotalAmount', 'AmountPaid', 'BalanceDue', 'PaymentTerms', 'NotesTerms',
  'PaymentMethod', 'PaymentDetailsJSON', 'LineItemsJSON'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var row = HEADERS.map(function (key) {
      if (key === 'Timestamp') return new Date();
      return data[key] !== undefined ? data[key] : '';
    });

    var invoiceNumber = data.InvoiceNumber || '';
    var targetRow = -1;
    if (invoiceNumber) {
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][INVOICE_NUMBER_COL - 1] === invoiceNumber) {
          targetRow = i + 1; // 1-indexed sheet row
          break;
        }
      }
    }

    if (targetRow > 0) {
      sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
