const regexForSlash = new RegExp("\/");

function fillDataFromObject(fillData) {
    fillData.forEach((element) =>
        fillFormula(
            element.idxList,
            element.refCellIdentifier,
            element.destinationCell));
}

//O(mn)
function tryReprocess(idxNotProcessedValue, col) {
    var returnProcessResult = {};
    idxNotProcessedValue.forEach((r) => {
        let sheet = SpreadsheetApp.getActiveSpreadsheet();
        let tt = sheet.getRange(col + r);
        let shopPreprocess = tt.getValue().split(' ');

        popy(shopPreprocess);

        let specialMap = getSheetDataInHashMap('E', '2', 'F', 'Constants');
        let shopWOlocation = shopPreprocess.join('');

        if (r != '') {
            Object.keys(specialMap).forEach(k => {
                if (shopWOlocation.includes(k)) {
                    returnProcessResult[r] = specialMap[k];
                }
            });
        }
    });
    return returnProcessResult
}

function getMerchantMap() {
    return getSheetDataInJsonObject('A', '2', 'B', 'Constants');
}

function getSpecialHandlingMap() {
    return getSheetDataInJsonObject('E', '2', 'F', 'Constants');
}

function getUniqueType() {
    let sheet = SpreadsheetApp.getActiveSpreadsheet();
    sheet = sheet.getSheetByName('Constants');
    let lastRow = getLastNonEmptyRow('B', 'Constants');

    let range = sheet.getRange("B1:B" + lastRow);
    let typeList = range.getValues();
    let types = typeList.flat();
    let uniqueItems = [...new Set(types)]
    return uniqueItems;
}

// default retrives to last non-empty row
function getSheetDataInJsonObject(startCol, startRow, endCol, sheetName) {
    var result = getSheetDataInRaw(startCol, startRow, endCol, sheetName);
    let lastRowParam = getLastNonEmptyRow(endCol, sheetName);
    return getJsonObjectFromArray(lastRowParam - 1, result);
}
function getSheetDataInHashMap(startCol, startRow, endCol, sheetName) {
    let rawResult = getSheetDataInRaw(startCol, startRow, endCol, sheetName);

    let hashmap = new Map();
    rawResult.forEach(e => {
        hashmap[e[0]] = e[1]
    })

    return hashmap;
}

function getSheetDataInRaw(startCol, startRow, endCol, sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();

    if (sheetName != null && sheetName != '') {
        sheet = sheet.getSheetByName(sheetName);
    }

    let lastRowParam = getLastNonEmptyRow(endCol, sheetName);
    let r = sheet.getRange(startCol + startRow + ":" + endCol + lastRowParam);
    return r.getValues();
}

function getRaw(startCol, startRow, endCol, sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    sheet = sheet.getSheetByName(sheetName);

    let lastRowParam = getLastNonEmptyRow(startCol, sheetName);
    let r = sheet.getRange(startCol + startRow + ":" + endCol + lastRowParam);
    return r.getValues();
}

function getJsonObjectFromArray(arrayLength, result) {
    let hashmap = new Map();
    for (let i = 0; i < arrayLength; i++) {
        hashmap[result[i][1]] = hashmap[result[i][1]] || [];
        hashmap[result[i][1]].push(result[i][0]);
    }
    return JSON.stringify(hashmap);
}

function fillFormula(idxList, refCellIdentifier, destinationCell) {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let cell = ss.getRange(destinationCell);
    let joinedList = idxList.map(s => refCellIdentifier + s).join('+');
    cell.setFormula("=SUM(" + joinedList + ")");
}

function clearRange(startCol, startRow, endCol, sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();

    if (sheetName != null && sheetName != '') {
        sheet = sheet.getSheetByName(sheetName);
    }

    let lastRowParam = getLastNonEmptyRow(endCol, sheetName);
    let r = sheet.getRange(startCol + startRow + ":" + endCol + lastRowParam);
    r.clearContent();
}

function getLastNonEmptyRow(col, sheetName) {
    let sheet = SpreadsheetApp.getActiveSpreadsheet();

    if (sheetName != null && sheetName != '') {
        sheet = sheet.getSheetByName(sheetName);
    }
    let range = sheet.getRange(col + "1:" + col + sheet.getLastRow());
    let txnList = range.getValues();

    // the header is filled or not, handle by adding offset
    let offset = Object.values(txnList[0]).toString().length > 0 ? 0 : 1;
    let nonEmpty = txnList.filter(x => Object.values(x).toString().length > 0);
    return nonEmpty.length + offset;
}

// this function works on undefined parameter list &&
//   it returns a combined array ignoring non-array element(s)
function mergeArray() {
    var returnArray = [];
    if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] != null && Array.isArray(arguments[i])) {
                returnArray.push(...Object.values(arguments[i]));
            }
        }
    }
    return returnArray;
}
