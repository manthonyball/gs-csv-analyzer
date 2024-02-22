 //best is to use API to get merchant type, but, they are paid , so, bad plan, use config values 
 //20240127 - removed cashback handling
function getSheet() {
  var merchantMap = getMerchantMap();
  var sheet = SpreadsheetApp.getActiveSheet();
  let startRow = 1;
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange("A" + startRow + ":" + "C" + lastRow);
  var txnList = range.getValues();
   
  var idxGro = filterData(merchantMap,txnList,'GRO'); 
  if (idxGro.length !== 0) fillFormula(idxGro,"B","F3");  
 
  var idxEnr = filterData(merchantMap,txnList,'ENR'); 
  if (idxEnr.length !== 0) fillFormula(idxEnr,"B","F4");  
 
  var idxIns = filterData(merchantMap,txnList,'INS'); 
  if (idxIns.length !== 0)  fillFormula(idxIns,"B","F5"); 
  
  //var idxCab = filterData(merchantMap,txnList,'CAB');
  //if (idxCab.length !== 0) fillFormula(idxCab,"B","F7"); 

  //agg. remaining into others
  const emptyNumber = [...Array(lastRow-1).keys()]
  emptyNumber.shift();
  emptyNumber.shift();
  let calculatedArray = [...idxGro, ...idxEnr, ...idxIns, ...idxCab];
  const idxNotProcessedValue = emptyNumber.filter(function (x) { 
      return calculatedArray.indexOf(x) < 0
  });
  if (idxNotProcessedValue.length !== 0) fillFormula(idxNotProcessedValue,"B","F6"); 
  
}
function filterData(merchantMap,data,merchantType){
  let queryableData = JSON.parse(merchantMap);
  let shopNameListSDx = data.map(getMassagedShopListInSoundex);
  let refListSDx = queryableData[merchantType].map(s=> soundex(s)); 
  let idx = shopNameListSDx.reduce(reduceToIdx(refListSDx),[]);
  let idxFinalized = idx.map(x=> x+1);
  return idxFinalized;
}

function reduceToIdx (refListSDx){
   return (accumulator,currentValue,currentIndex, array) => {
      if(refListSDx.includes(currentValue))  
        accumulator.push(currentIndex); 
      return accumulator;
  }
} 

//this is a fuzzy matching using phenetic alg'm 
function getMassagedShopListInSoundex(id, idx, arr){
    let shopWLocation = arr[idx][2].split(' ') 
    shopWLocation.pop(); // to remove province 
    shopWLocation.pop(); // to remove area 
    let shopWOlocation = shopWLocation.join(' ');
    let finalShop = "";
    // to special handle LOBLAW's family
    if (shopWOlocation.includes("FRILLS") || shopWOlocation.includes("RCSS")) 
      finalShop = "LOBLAWS";
    else 
      finalShop = shopWOlocation;
    return soundex(finalShop); 
}

function fillFormula(idxList,refCellIdentifier,destinationCell){
  let ss = SpreadsheetApp.getActiveSpreadsheet();  
  let cell = ss.getRange(destinationCell);
  let joinedList = idxList.map(s=>refCellIdentifier+s).join('+');
  cell.setFormula("=SUM("+joinedList+")");
}

function getMerchantMap() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var viewSheet = ss.getSheetByName('Constants');
  let lastRowParam = viewSheet.getLastRow();
  let r = viewSheet.getRange("A2:B" + lastRowParam); 
  var result = r.getValues(); 
  let hashmap = new Map()
  for (let i = 0; i < lastRowParam-1; i++) {
    hashmap[result[i][1]] = hashmap[result[i][1]] || []
    hashmap[result[i][1]].push(result[i][0]) 
  }
  return JSON.stringify(hashmap);
}
