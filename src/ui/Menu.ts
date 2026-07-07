/**
 * Creates the UK Tax Tracker custom menu in the Google Sheets toolbar.
 * Should be called from the onOpen trigger in gas-entry.ts.
 */
export function createUkTaxMenu(ui: GoogleAppsScript.Base.Ui): void {
  ui.createMenu('UK Tax Tracker')
    .addItem('Calculate Current Year', 'calculateCurrentYear')
    .addItem('Generate Report', 'generateReport')
    .addSeparator()
    .addItem('Settings', 'openSettings')
    .addToUi();
}
