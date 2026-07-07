import { TaxReport, MonthlyRow } from './ReportGenerator';
import { TaxStatus } from '../models/TaxSummary';
import { ILogger } from '../utils/Logger';

/**
 * Exports a TaxReport to Google Sheets.
 * This is the only file that calls SpreadsheetApp — all Sheets API access is isolated here.
 */
export class SheetExporter {
  constructor(
    private readonly spreadsheetId: string,
    private readonly logger: ILogger
  ) {}

  exportReport(report: TaxReport): void {
    const spreadsheet = this.getSpreadsheet();
    if (!spreadsheet) return;

    this.writeSummaryTab(spreadsheet, report);
    this.writeMonthlyTab(spreadsheet, report.monthlyBreakdown);
    this.logger.info('Report exported to spreadsheet successfully');
  }

  private getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet | null {
    try {
      if (this.spreadsheetId) {
        return SpreadsheetApp.openById(this.spreadsheetId);
      }
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch {
      this.logger.error('Failed to open spreadsheet');
      return null;
    }
  }

  private writeSummaryTab(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    report: TaxReport
  ): void {
    const sheet = this.getOrCreateSheet(spreadsheet, 'UK Tax Summary');
    sheet.clearContents();
    sheet.clearFormats();

    const { summary } = report;
    const startYear = summary.taxYearStart.getFullYear();
    const endYear = summary.taxYearEnd.getFullYear();
    const taxYearLabel = `${startYear}/${String(endYear).slice(-2)}`;

    const rows: (string | number | Date)[][] = [
      ['UK TAX DAY TRACKER', ''],
      ['', ''],
      ['Tax Year', taxYearLabel],
      ['Generated', report.generatedAt],
      ['', ''],
      ['DAYS', ''],
      ['UK Days Used', summary.totalUkDays],
      ['UK Working Days', summary.workingUkDays],
      ['', ''],
      ['LIMITS', ''],
      ['Base Total Day Limit', summary.totalDayLimit],
      ['Working Day Limit', summary.workingDayLimit],
      ['Effective Total Limit', summary.effectiveLimit],
      ['Days Remaining', summary.remainingDays],
      ['', ''],
      ['STATUS', summary.status],
      ['', ''],
      ['NOTE', ''],
      ['', 'Effective limit reduces from 90 to 60 days if working days exceed 30.'],
      ['', 'This tool is for record-keeping only. Seek professional tax advice.'],
    ];

    sheet.getRange(1, 1, rows.length, 2).setValues(rows);
    this.applyStatusFormatting(sheet, summary.status);
  }

  private writeMonthlyTab(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    monthly: readonly MonthlyRow[]
  ): void {
    const sheet = this.getOrCreateSheet(spreadsheet, 'Monthly Breakdown');
    sheet.clearContents();
    sheet.clearFormats();

    const headers: (string | number)[][] = [
      ['Month', 'Year', 'Total UK Days', 'Working UK Days'],
    ];
    const dataRows = monthly.map((r) => [
      r.monthName,
      r.year,
      r.totalUkDays,
      r.workingUkDays,
    ]);

    const allRows = [...headers, ...dataRows];
    if (allRows.length > 0) {
      sheet.getRange(1, 1, allRows.length, 4).setValues(allRows);
    }
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }

  private applyStatusFormatting(
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    status: TaxStatus
  ): void {
    const statusRow = 16;
    const colours: Record<TaxStatus, string> = {
      Safe: '#d4edda',
      Warning: '#fff3cd',
      'Over Limit': '#f8d7da',
    };
    sheet.getRange(statusRow, 1, 1, 2).setBackground(colours[status]);
    sheet.getRange(1, 1).setFontWeight('bold').setFontSize(14);
  }

  private getOrCreateSheet(
    spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    name: string
  ): GoogleAppsScript.Spreadsheet.Sheet {
    return spreadsheet.getSheetByName(name) ?? spreadsheet.insertSheet(name);
  }
}
