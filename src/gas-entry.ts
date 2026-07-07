import { runCalculation } from './app';
import { createUkTaxMenu } from './ui/Menu';

/**
 * Triggered automatically when the bound spreadsheet is opened.
 * Adds the UK Tax Tracker menu to the toolbar.
 * Called via gas-declarations.js → UkTaxBundle.onOpen()
 */
export function onOpen(): void {
  createUkTaxMenu(SpreadsheetApp.getUi());
}

/**
 * Runs the full calculation for the current tax year and exports results to Sheets.
 * Triggered from the UK Tax Tracker menu.
 */
export function calculateCurrentYear(): void {
  try {
    const report = runCalculation();
    const { summary } = report;
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `UK Days: ${summary.totalUkDays} / ${summary.effectiveLimit}` +
        `  |  Working Days: ${summary.workingUkDays} / ${summary.workingDayLimit}` +
        `  |  Status: ${summary.status}`,
      'UK Tax Tracker',
      12
    );
  } catch (e) {
    SpreadsheetApp.getUi().alert(
      'UK Tax Tracker — Error',
      `Calculation failed: ${String(e)}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Alias for calculateCurrentYear. Triggered from the Generate Report menu item.
 */
export function generateReport(): void {
  calculateCurrentYear();
}

/**
 * Shows a settings information dialog.
 * A full settings UI is planned for a future version.
 */
export function openSettings(): void {
  SpreadsheetApp.getUi().alert(
    'UK Tax Tracker — Settings',
    'Settings are configured in src/config/Settings.ts (DEFAULT_SETTINGS).\n\n' +
      'A settings editor UI is planned for a future version.\n\n' +
      'Rebuild and redeploy after changing settings.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
