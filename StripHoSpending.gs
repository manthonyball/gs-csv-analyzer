function stripHoSpending() {
    var sheet = SpreadsheetApp.getActiveSheet();
    let startRow = 1;
    var lastRow = getLastNonEmptyRow("K");
    var range = sheet.getRange("K" + startRow + ":" + "N" + lastRow);
    var txnList = range.getValues();
     
//  ////Logger.log(Date.now())
   var idxFoodBeverage = filterData( txnList, 'F&B',"fuzzy");
   if (idxFoodBeverage.length !== 0)
       fillFormula(idxFoodBeverage, "L", "R5");

  // Logger.log("++++++++++++")
  // Logger.log(Date.now())  
     var idxCellPhonePlan = filterData( txnList, 'TEL');  
     if (idxCellPhonePlan.length !== 0)      
       fillFormula(idxCellPhonePlan, "L", "R3");
  
  // Logger.log("++++++++++++")
  // Logger.log(Date.now())
     var idxTransit = filterData(txnList, 'TRANSIT',"fuzzy");
     if (idxTransit.length !== 0)
         fillFormula(idxTransit, "L", "R4");
  
  // Logger.log("++++++++++++")
  // Logger.log(Date.now())
     var idxHealth = filterData(txnList,'HEL',"fuzzy");
     if (idxHealth.length !== 0)
         fillFormula(idxHealth, "L", "R7");
  
  // Logger.log("++++++++++++")
  // Logger.log(Date.now())
     var idxPayment = filterData(txnList,'PAY');
     if (idxPayment.length !== 0)
         fillFormula(idxPayment, "L", "R9");
  
  // Logger.log("++++++++++++")
  // Logger.log(Date.now())

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

    if (idxNotProcessedValue.length !== 0)
        fillFormula(idxNotProcessedValue, "L", "R6");
}
