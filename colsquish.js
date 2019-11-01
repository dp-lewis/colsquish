function findColumns(sheet, headerName) {
  var indices = [];
  var headers = sheet[0];
  var idx = headers.indexOf(headerName);

  while (idx != -1) {
    indices.push(idx);
    idx = headers.indexOf(headerName, idx + 1);
  }
  return indices;
}

function removeColumns(sheet, header) {
  var updatedSheet = [];
  var columnIndices = findColumns(sheet, header);
  var row;
  var col;

  for (row = 0; row < sheet.length; row++) {
    updatedSheet[row] = [];
    for (col = 0; col < sheet[row].length; col++) {
      if (columnIndices.indexOf(col) === -1) {
        updatedSheet[row].push(sheet[row][col]);
      }
    }
  }

  return updatedSheet;
}

function createOneColumnFromMany(many) {
  var newColumn = [];
  var row;
  var col;
  for (row = 0; row < many.length; row++) {
    for (col = 0; col < many[row].length; col++) {
      if (many[row][col]) {
        newColumn[row] = [many[row][col]];
      }
    }
  }
  return newColumn;
}

function insertNewColumn(sheet, newColumn, where) {
  // loop through the sheet
  var newSheet = [];
  var row;
  var col;

  for (row = 0; row < sheet.length; row++) {
    newSheet[row] = [];
    for (col = 0; col < sheet[row].length; col++) {
      if (col === where) {
        newSheet[row].push(newColumn[row][0]);
      }
      newSheet[row].push(sheet[row][col]);

      if (col == sheet[row].length - 1 && where >= sheet[row].length) {
        newSheet[row].push(newColumn[row][0]);
      }
    }
  }

  return newSheet;
}

function extractColumns(sheet, header) {
  var newSheet = [];
  var indices = findColumns(sheet, header);
  var row;
  var col;
  for (row = 0; row < sheet.length; row++) {
    newSheet[row] = [];
    for (col = 0; col < sheet[row].length; col++) {
      if (indices.indexOf(col) != -1) {
        newSheet[row].push(sheet[row][col]);
      }
    }
  }

  return newSheet;
}

function squish(sheet, header) {
  // find all the instances of the header
  var columnIndices = findColumns(sheet, header);

  if (columnIndices.length === 0) {
    return sheet;
  }
  var firstInstance = columnIndices[0];
  var extractedColumns = extractColumns(sheet, header);
  var combinedColumn = createOneColumnFromMany(extractedColumns);
  var sheetWithout = removeColumns(sheet, header);
  var finalSheet = insertNewColumn(sheetWithout, combinedColumn, firstInstance);
  return finalSheet;
}

/* 
  Google Sheet Specific Bits
*/
function runSquish() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  var newData = squish(data, "Date");
  var row;
  sheet.clear();
  for (row = 0; row < newData.length; row++) {
    sheet.appendRow(newData[row]);
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu("Column Squish")
    .addItem("Squish", "runSquish")
    .addToUi();
}

if (!exports) {
  var exports = {};
}

exports.findColumns = findColumns;
exports.removeColumns = removeColumns;
exports.createOneColumnFromMany = createOneColumnFromMany;
exports.insertNewColumn = insertNewColumn;
exports.squish = squish;
exports.extractColumns = extractColumns;