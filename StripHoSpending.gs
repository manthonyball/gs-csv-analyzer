function stripHoSpending() {
    var sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 1;
    var lastRow = getLastNonEmptyRow("K");
    var range = sheet.getRange("K" + startRow + ":" + "N" + lastRow);
    var txnList = range.getValues();
    var fillData = [];

    var idxFoodBeverage = filterData(txnList, 'F&B', "fuzzy");
    var idxCellPhonePlan = filterData(txnList, 'TEL');
    var idxTransit = filterData(txnList, 'TRANSIT', "fuzzy");
    var idxHealth = filterData(txnList, 'HEL', "fuzzy");
    var idxPayment = filterData(txnList, 'PAY');

    // create an empty array for matching
    const emptyNumber = [...Array(lastRow + 1).keys()]
    emptyNumber.shift();
    emptyNumber.shift();

    let calculatedArray = [
        ...idxCellPhonePlan, ...idxTransit, ...idxPayment, ...idxFoodBeverage, ...idxHealth
    ];

    // if present in calculatedArray, exlcude in others
    const idxNotProcessedValue = emptyNumber.filter(
            x => calculatedArray.indexOf(x) < 0);

    const reprocessedItems = [];
    const reprocessResult = tryReprocess(txnList, idxNotProcessedValue);
    for (const[key, value]of Object.entries(reprocessResult)) {
        switch (value) {
        case 'F&B':
            idxFoodBeverage.push(key);
            reprocessedItems.push(Number.parseInt(key));
            break;
        }
    }
    // if got set operation, should by more efficient ; O(mn)
    let afterReprocessed = idxNotProcessedValue.filter(ele => !(reprocessedItems.includes(ele)))

        if (idxFoodBeverage.length !== 0)
            fillData.push(new FillTheFormDto('F&B', idxFoodBeverage, "L", "R5"));
        if (idxCellPhonePlan.length !== 0)
            fillData.push(new FillTheFormDto('TEL', idxCellPhonePlan, "L", "R3"));
        if (idxTransit.length !== 0)
            fillData.push(new FillTheFormDto('TRANSIT', idxTransit, "L", "R4"));
        if (idxHealth.length !== 0)
            fillData.push(new FillTheFormDto('HEL', idxHealth, "L", "R7"));
        if (idxPayment.length !== 0)
            fillData.push(new FillTheFormDto('PAY', idxPayment, "L", "R9"));
        if (afterReprocessed.length !== 0)
            fillData.push(new FillTheFormDto('OTH', afterReprocessed, "L", "R6"));

        fillDataFromObject(fillData);
}
