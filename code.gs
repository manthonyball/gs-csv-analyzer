/**
 * Verdict :
 * best is to use API to get merchant type, but, they are paid
 *   so, bad plan, use config values in the Spreadsheet tab "Constants"
 */
function getSheet() {
    var sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 1;
    var lastRow = getLastNonEmptyRow("A");

    var range = sheet.getRange("A" + startRow + ":" + "C" + lastRow);
    var txnList = range.getValues();
    var fillData = [];

    var idxGro = filterData(txnList, 'GRO', "fuzzy");
    var idxEnr = filterData(txnList, 'ENR', "fuzzy");

    var idxIns = filterData(txnList, 'INS');

    //var idxCab = filterData(txnList,'CAB');
    //if (idxCab.length !== 0) fillFormula(idxCab,"B","F7");

    //agg. remaining into others
    const emptyNumber = [...Array(lastRow + 1).keys()]
    emptyNumber.shift();
    emptyNumber.shift();

    let calculatedArray = mergeArray(
            typeof(idxCab) === "undefined" ? null : idxCab,
            typeof(idxGro) === "undefined" ? null : idxGro,
            typeof(idxEnr) === "undefined" ? null : idxEnr,
            typeof(idxIns) === "undefined" ? null : idxIns);

    // let calculatedArray = [...idxGro, ...idxEnr, ...idxIns, ...idxCab];
    // if present in calculatedArray, exlcude in others
    const idxNotProcessedValue = emptyNumber.filter(
            x => calculatedArray.indexOf(x) < 0);

    const reprocessedItems = [];
    const reprocessResult = tryReprocess(txnList, idxNotProcessedValue);
    for (const [key, value] of Object.entries(reprocessResult)) {
        switch (value) {
        case 'GRO':
            idxGro.push(key);
            reprocessedItems.push(Number.parseInt(key));
            break;
        }
    }

    // if got set operation, should by more efficient ; O(mn)
    let afterReprocessed = idxNotProcessedValue.filter(
            ele => !(reprocessedItems.includes(ele)));

    if (afterReprocessed.length !== 0)
        fillData.push(new FillTheFormDto('OTH', afterReprocessed, "B", "F6"));

    if (idxGro.length !== 0)
        fillData.push(new FillTheFormDto('Gro', idxGro, "B", "F3"));
    if (idxEnr.length !== 0)
        fillData.push(new FillTheFormDto('Enr', idxEnr, "B", "F4"));
    if (idxIns.length !== 0)
        fillData.push(new FillTheFormDto('Ins', idxIns, "B", "F5"));

    fillDataFromObject(fillData);
}
