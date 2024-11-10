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

 // Logger.log(Date.now())
  var idxGro = filterData(txnList,'GRO',"fuzzy"); 
  if (idxGro.length !== 0)
    fillFormula(idxGro,"B","F3");
 
 // Logger.log("++++++++++++")
 // Logger.log(Date.now())
  var idxEnr = filterData(txnList,'ENR',"fuzzy");
  if (idxEnr.length !== 0) 
    fillFormula(idxEnr,"B","F4");
 
 // Logger.log("++++++++++++")
 // Logger.log(Date.now())
  var idxIns = filterData(txnList,'INS');
  if (idxIns.length !== 0)  
    fillFormula(idxIns,"B","F5");
  
  //var idxCab = filterData(txnList,'CAB');
  //if (idxCab.length !== 0) fillFormula(idxCab,"B","F7"); 

  //agg. remaining into others
  const emptyNumber = [...Array(lastRow+1).keys()] 
  emptyNumber.shift();
  emptyNumber.shift();
 
  let calculatedArray = mergeArray(
      typeof (idxCab) === "undefined" ? null: idxCab, 
      typeof (idxGro) === "undefined" ? null: idxGro, 
      typeof (idxEnr) === "undefined" ? null: idxEnr, 
      typeof (idxIns) === "undefined" ? null: idxIns
    ) ; 
 
  // let calculatedArray = [...idxGro, ...idxEnr, ...idxIns, ...idxCab];
  // if present in calculatedArray, exlcude in others
  const idxNotProcessedValue = emptyNumber.filter(
    x=>calculatedArray.indexOf(x) < 0
    );
  
  if (idxNotProcessedValue.length !== 0)
    fillFormula(idxNotProcessedValue,"B","F6");
     // writeToSheetList.push([idxNotProcessedValue,"B","F6"]);
}