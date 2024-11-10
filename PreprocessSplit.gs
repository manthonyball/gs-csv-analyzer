function dataIngest() {
    var sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 1;
    let lastRow = getLastNonEmptyRow("A");
    let range = sheet.getRange("A" + startRow + ":" + "A" + lastRow);
    var txnList = range.getValues();

    clearRange('G','1','I','preprocess-worksheet');
    clearRange('L','1','N','preprocess-worksheet');
    clearRange('B','1','D','preprocess-worksheet');

    var merchantMap = new Map();
    for (const merchant of getRaw('A','2','B','Constants'))
      merchantMap.set(soundex(merchant[0]), merchant[1]);
     
    var sharedType = getRaw('I','2','I','Constants').flat();
    var rowNum = 0;

    for (const r of txnList) {
      rowNum ++;
      let rowArray = r[0].split(',');
      if(rowArray[2]==null) continue;
      let txnDate = rowArray[2];
      let txnAmt  = rowArray[4];
      let txnDesp = rowArray[5];

      let merchantType = merchantMap.get(getShopNameInSoundex(txnDesp))?? "OTH";

      var rangeSpreading;

      if(sharedType.includes(merchantType))
        rangeSpreading = sheet.getRange("G" + rowNum + ":" + "I" + rowNum);
      else 
        rangeSpreading = sheet.getRange("L" + rowNum + ":" + "N" + rowNum);

      rangeSpreading.setValues([[txnDate,txnAmt,txnDesp]]);

      let rangeOriginal = sheet.getRange("B" + rowNum + ":" + "D" + rowNum);
      rangeOriginal.setValues([[txnDate,txnAmt,txnDesp]]);
    }
}

const objectMapSoundux = (obj, fn) =>
    Object.entries(obj).map(
      ([k, v], i) => [k, v.map(shop=>fn(shop))]
    );