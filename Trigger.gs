function onOpen(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var templateSheet = sheet.getSheetByName('template');
    let todayIs = new Date();
    let pastMonth = todayIs.getMonth() - 1;
    let todayMonth = todayIs.getMonth();
    let todayYear = todayIs.getFullYear();
    const formatter = new Intl.DateTimeFormat('us', {
        month: 'short'
    });
    const pastMonth_Eng = formatter.format(new Date(todayYear, pastMonth));
    const currentMonth_Eng = formatter.format(new Date(todayYear, todayMonth));
    const targetSheetName = todayYear + '.' + pastMonth_Eng + '10-' + currentMonth_Eng + '9';
    const sheetArray = sheet.getSheets().filter(s => s.getName() == targetSheetName);
    if (sheetArray.length == 0)
        sheet.insertSheet(targetSheetName, {
            template: templateSheet
        });
    SpreadsheetApp.setActiveSheet(sheet.getSheetByName(targetSheetName));

    // https://developers.google.com/apps-script/guides/triggers
    /*****
     *
    SpreadsheetApp.getUi() // Or DocumentApp, SlidesApp, or FormApp.
    .createMenu('Custom Menu')
    .addItem('First item', 'menuItem1')
    .addToUi();
     *
     */

}
