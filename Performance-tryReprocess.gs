/****
 * the logic needs to recognize below
 *  vi's no frill
 *  LCBO/RAO
 *  RCSS Scarborugh
 *
 * tryReprocess_ori
 * tryReprocess_ath
 * tryReprocess_byChatGpt
 * tryReprocess_2
 */

function runner() {
    const reprocessPercentage = 0.2;
    const transactionCount = 50;
    let [runner_txnList, runner_idxNotProcessedValue] = transationGenerator(reprocessPercentage, transactionCount);

    Logger.log("ini-ignore");
    tryReprocess_ori(runner_txnList, runner_idxNotProcessedValue);
    tryReprocess_ath(runner_txnList, runner_idxNotProcessedValue);
    Logger.log("end");

    var duration = [];

    for (let i = 1; i < 15; i++) {
        Logger.log("r" + i);
        let seq = getRandomIntInclusive(1, 2);
        [runner_txnList, runner_idxNotProcessedValue] = transationGenerator();
        let oriStartTime = new Date().getTime();
        let athStartTime = new Date().getTime();
        let noOptimStartTime = new Date().getTime();
        let oriDuration = 0;
        let athDuration = 0;
        let noOptimDuration = 0;
        switch (seq) {
        case 1:
            oriStartTime = new Date().getTime();
            tryReprocess_ori(runner_txnList, runner_idxNotProcessedValue);
            oriDuration = new Date().getTime() - oriStartTime;

            athStartTime = new Date().getTime();
            tryReprocess_ath(runner_txnList, runner_idxNotProcessedValue);
            athDuration = new Date().getTime() - athStartTime;

            noOptimStartTime = new Date().getTime();
            tryReprocess_no_early_return(runner_txnList, runner_idxNotProcessedValue);
            noOptimDuration = new Date().getTime() - noOptimStartTime;

            duration.push([oriDuration, athDuration, noOptimDuration]);
            break;
        case 2:
            athStartTime = new Date().getTime();
            tryReprocess_ath(runner_txnList, runner_idxNotProcessedValue);
            athDuration = new Date().getTime() - athStartTime;

            oriStartTime = new Date().getTime();
            tryReprocess_ori(runner_txnList, runner_idxNotProcessedValue);
            oriDuration = new Date().getTime() - oriStartTime;

            noOptimStartTime = new Date().getTime();
            tryReprocess_no_early_return(runner_txnList, runner_idxNotProcessedValue);
            noOptimDuration = new Date().getTime() - noOptimStartTime;

            duration.push([oriDuration, athDuration, noOptimDuration]);
            break;
        }
    }
    writeRsultToSheet(reprocessPercentage, transactionCount, duration);
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    // The maximum is inclusive and the minimum is inclusive
}

const location = " TORONTO ON";
function getDescription(defaultMode = "") {
    let mode = getRandomIntInclusive(1, 5);
    if (defaultMode != "")
        return defaultMode + Math.random().toFixed() + location;

    var storeName = "";
    switch (mode) {
    case 1:
        storeName = "A & W ";
        break;
    case 2:
        storeName = "LCBO/RAO ";
        break;
    case 3:
        storeName = "vi's no frill ";
        break;
    case 4:
        storeName = "RCSS Scarborugh ";
        break;
    default:
        storeName = "this ABC ";
    }
    return storeName + Math.random().toFixed() + location;
}

function transationGenerator(reprocessPercentage, transactionCount) {
    const txnList = [];
    const notProcessList = [];

    txnList.push(["Transaction Date", "Transaction Amount", "Description"]);
    var numOfReprocess = 0;
    for (let i = 1; i < transactionCount; i++) {
        let day = getRandomIntInclusive(1, 29);
        let txnDate = new Date().setDate(day);
        let amount = Math.random().toFixed(2);
        let description = getDescription();
        let currentReprocessPercentage = numOfReprocess / transactionCount
            if (!description.startsWith('this ABC')
                 && currentReprocessPercentage < reprocessPercentage) {
                let offSet = i + 1;
                notProcessList.push(offSet);
                numOfReprocess++;
                let aTxn = [txnDate, amount, description];
                txnList.push(aTxn);
            }
    }
    let emptySpotsToBeFilled = transactionCount - numOfReprocess;

    for (let i = 1; i < emptySpotsToBeFilled; i++) {
        let day = getRandomIntInclusive(1, 29);
        let txnDate = new Date().setDate(day);
        let amount = Math.random().toFixed(2);
        let description = getDescription("fillTheEmpty");
        let aTxn = [txnDate, amount, description];
        txnList.push(aTxn);
    }

    return [txnList, notProcessList];
}

function writeRsultToSheet(reprocessPercentage, transactionCount, duration) {
    let sheet = SpreadsheetApp.getActiveSpreadsheet();
    sheet = sheet.getSheetByName('Performance');
    var lastRow = getLastNonEmptyRow("A", "Performance") + 1;
    let cell = sheet.getRange("A" + lastRow);
    cell.setValue(new Date());
    cell = sheet.getRange("B" + lastRow);
    cell.setValue(reprocessPercentage);
    cell = sheet.getRange("C" + lastRow);
    cell.setValue(transactionCount);

    //DEF...
    var flyingCol = 68;
    duration.forEach(d => {
        cell = sheet.getRange(String.fromCharCode(flyingCol) + lastRow);
        cell.setValue("{" + d[0] + ";" + d[1] + ";" + d[2] + "}");
        flyingCol++;
    });
}

/////////////////////////////////
// test targets
/////////////////////////////////

//O(nm + knm)
function tryReprocess_ath(txnList, idxNotProcessedValue) {
    const returnProcessResult = {};
    const specialMap = getSheetDataInHashMap('E', '2', 'F', 'Constants');

    const mappedTxn = idxNotProcessedValue.map(txn => {
        let shopNamePreprocess = txnList[txn - 1][2].split(' ');
        popy(shopNamePreprocess);
        return shopNamePreprocess.join('')
        .replace(/[^a-zA-Z0-9]/g, '')
         + '-' + txn.toString().padStart(3, '0');
    });

    let longReprocessedString = mappedTxn.join("; ");
    longReprocessedString = longReprocessedString + "; ";

    for (const key of Object.keys(specialMap)) {
        const regExp = new RegExp(key + '[\\w]+-[0-9]{3}; ', 'gi');
        const matches = longReprocessedString.match(regExp);
        if (matches != null) {
            matches.forEach(m => {
                let rowNum = Number.parseInt(m.split('-')[1]);
                returnProcessResult[rowNum] = specialMap[key];
            })
        }
    }

    return returnProcessResult;
}

//O(nkm)
function tryReprocess_ori(txnList, idxNotProcessedValue) {
    const returnProcessResult = {};
    const specialMap = getSheetDataInHashMap('E', '2', 'F', 'Constants');
    idxNotProcessedValue.forEach((r) => {
        let shopNamePreprocess = txnList[r - 1][2].split(' ');
        popy(shopNamePreprocess);
        // special handle col
        let shopWOlocation = shopNamePreprocess.join('');

        if (r != '') {
            for (const key of Object.keys(specialMap)) {
                if (shopWOlocation.includes(key)) {
                    returnProcessResult[r] = specialMap[key];
                    return;
                }
            }
        }
    });
    return returnProcessResult;
}

//O(nkm)
function tryReprocess_no_early_return(txnList, idxNotProcessedValue) {
    const returnProcessResult = {};
    const specialMap = getSheetDataInHashMap('E', '2', 'F', 'Constants');
    idxNotProcessedValue.forEach((r) => {
        let shopNamePreprocess = txnList[r - 1][2].split(' ');
        popy(shopNamePreprocess);
        // special handle col
        let shopWOlocation = shopNamePreprocess.join('');

        if (r != '') {
            for (const key of Object.keys(specialMap)) {
                if (shopWOlocation.includes(key)) {
                    returnProcessResult[r] = specialMap[key];
                }
            }
        }
    });
    return returnProcessResult;
}
