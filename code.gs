/**
 * Verdict : 
 * best is to use API to get merchant type, but, they are paid 
 *   so, bad plan, use config values in the Spreadsheet tab "Constants"
 * 
 * modifications :
 * 20240127 - removed cashback handling
 * 20240319 - ENH on spread-handling 
 * 20240424 - code sanitary on const/let 
*/

var currentSheet = SpreadsheetApp.getActiveSheet(); 
function getSheet() {
  const merchantMap = getMerchantMap();
  const startRow = 1;
  const lastRow = currentSheet.getLastRow();
  const range = currentSheet.getRange("A" + startRow + ":" + "C" + lastRow);
  const txnList = range.getValues();
   
  const idxGro = filterData(merchantMap,txnList,'GRO'); 
  if (idxGro.length !== 0) fillFormula(idxGro,"B","F3");  
 
  const idxEnr = filterData(merchantMap,txnList,'ENR'); 
  if (idxEnr.length !== 0) fillFormula(idxEnr,"B","F4");  
 
  const idxIns = filterData(merchantMap,txnList,'INS'); 
  if (idxIns.length !== 0)  fillFormula(idxIns,"B","F5"); 
  
  //var idxCab = filterData(merchantMap,txnList,'CAB');
  //if (idxCab.length !== 0) fillFormula(idxCab,"B","F7"); 

  //agg. remaining into others
  let emptyNumber = [...Array(lastRow-1).keys()]
  emptyNumber.shift();
  emptyNumber.shift();
 
  const calculatedArray = mergeArray(
      typeof (idxCab) === "undefined" ? null: idxCab, 
      typeof (idxGro) === "undefined" ? null: idxGro, 
      typeof (idxEnr) === "undefined" ? null: idxEnr, 
      typeof (idxIns) === "undefined" ? null: idxIns
    ) ; 

  // let calculatedArray = [...idxGro, ...idxEnr, ...idxIns, ...idxCab];
  const idxNotProcessedValue = emptyNumber.filter(function (x) { 
      return calculatedArray.indexOf(x) < 0
  });

  if (idxNotProcessedValue.length !== 0) 
    fillFormula(idxNotProcessedValue,"B","F6"); 
  
}

//this function works on undefined parameter list && 
//   it returns a combined array ignoring non-array element(s)  
function mergeArray(){
  let returnArray=[];
    if(arguments.length > 0) {
          for(var i = 0; i < arguments.length ; i++){ 
            if(arguments[i] != null && Array.isArray(arguments[i])){ 
              returnArray.push(...Object.values(arguments[i]));
            }
          }
    }
  return returnArray;
}

function filterData(merchantMap,data,merchantType){
  const queryableData = JSON.parse(merchantMap);
  const shopNameListSDx = data.map(getMassagedShopListInSoundex);
  const refListSDx = queryableData[merchantType].map(s=> soundex(s)); 
  const idx = shopNameListSDx.reduce(reduceToIdx(refListSDx),[]);
  const idxFinalized = idx.map(x=> x+1); // uses the GS row number as index and offfset 
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
    const shopWOlocation = shopWLocation.join(' ');
    let finalShop = "";
    // to special handle LOBLAW's family
    if (shopWOlocation.includes("FRILLS") || shopWOlocation.includes("RCSS")) 
      finalShop = "LOBLAWS";
    else 
      finalShop = shopWOlocation;
    return soundex(finalShop); 
}

function fillFormula(idxList,refCellIdentifier,destinationCell){ 
  const joinedList = idxList.map(s=>refCellIdentifier+s).join('+');
  let cell = currentSheet.getRange(destinationCell);
  cell.setFormula("=SUM("+joinedList+")");
}

function getMerchantMap() {
  const constantSheet = SpreadsheetApp.getActive().getSheetByName('Constants');
  const lastRowParam = constantSheet.getLastRow();
  const r = constantSheet.getRange("A2:B" + lastRowParam); 
  const result = r.getValues(); 
  let hashmap = new Map()
  for (let i = 0; i < lastRowParam-1; i++) {
    hashmap[result[i][1]] = hashmap[result[i][1]] || []
    hashmap[result[i][1]].push(result[i][0]) 
  }
  return JSON.stringify(hashmap);
}
