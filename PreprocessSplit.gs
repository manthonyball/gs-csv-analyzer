function dataIngest() {
    var sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 1;
    let lastRow = getLastNonEmptyRow("A");
    let range = sheet.getRange("A" + startRow + ":" + "A" + lastRow);
    var txnList = range.getValues();

    let theLastRow = getMax([
                getLastNonEmptyRow('I', 'preprocess-worksheet'),
                getLastNonEmptyRow('N', 'preprocess-worksheet'),
                getLastNonEmptyRow('D', 'preprocess-worksheet')]);
    Logger.log(theLastRow)
    clearRange('G', '1', 'I', 'preprocess-worksheet', theLastRow);
    clearRange('L', '1', 'N', 'preprocess-worksheet', theLastRow);
    clearRange('B', '1', 'D', 'preprocess-worksheet', theLastRow);

    var merchantMap = new Map();
    for (const merchant of getRaw('A', '2', 'B', 'Constants'))
        merchantMap.set(soundex(merchant[0]), merchant[1]);

    var sharedType = getRaw('I', '2', 'I', 'Constants').flat();
    var rowNum = 0;
    var otherTag = Common.OtherTag;
    
	const specialMap = getSheetDataInHashMap('E', '2', 'F', 'Constants');
    for (const r of txnList) {
        rowNum++;
        let rowArray = r[0].split(',');
        if (rowArray[2] == null)
            continue;
        let txnDate = rowArray[2];
        let txnAmt = rowArray[4];
        let txnDesp = rowArray[5];

        let merchantType = merchantMap.get(getShopNameInSoundex(txnDesp)) ?? otherTag;
        if (merchantType == otherTag)
            merchantType = tryReprocessSingleTransaction(txnDesp, specialMap);

        var rangeSpreading = sharedType.includes(merchantType) ? 
                                sheet.getRange("G" + rowNum + ":" + "I" + rowNum):
								  sheet.getRange("L" + rowNum + ":" + "N" + rowNum); 

        rangeSpreading.setValues([[txnDate, txnAmt, txnDesp]]);

        let rangeOriginal = sheet.getRange("B" + rowNum + ":" + "D" + rowNum);
        rangeOriginal.setValues([[txnDate, txnAmt, txnDesp]]);
    }
}

const objectMapSoundux = (obj, fn) =>
Object.entries(obj).map(
    ([k, v], i) => [k, v.map(shop => fn(shop))]);
