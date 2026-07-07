import { TaxDay } from '../models/TaxDay';
import { Country } from '../models/Country';
import { TaxSummary } from '../models/TaxSummary';
import { getMonthName } from '../utils/DateUtils';

/** A single row in the monthly breakdown report. */
export interface MonthlyRow {
  readonly year: number;
  readonly month: number;
  readonly monthName: string;
  readonly totalUkDays: number;
  readonly workingUkDays: number;
}

/** The complete tax report for a tax year. */
export interface TaxReport {
  readonly summary: TaxSummary;
  readonly monthlyBreakdown: readonly MonthlyRow[];
  readonly generatedAt: Date;
}

/**
 * Generates a TaxReport from classified tax days and a pre-computed summary.
 */
export function generateReport(days: readonly TaxDay[], summary: TaxSummary): TaxReport {
  return {
    summary,
    monthlyBreakdown: buildMonthlyBreakdown(days),
    generatedAt: new Date(),
  };
}

function buildMonthlyBreakdown(days: readonly TaxDay[]): MonthlyRow[] {
  const ukDays = days.filter((d) => d.country === Country.UnitedKingdom);
  const monthMap = new Map<string, MonthlyRow>();

  for (const day of ukDays) {
    const year = day.date.getFullYear();
    const month = day.date.getMonth();
    const key = `${year}-${String(month).padStart(2, '0')}`;
    const existing = monthMap.get(key);

    monthMap.set(key, {
      year,
      month,
      monthName: getMonthName(month),
      totalUkDays: (existing?.totalUkDays ?? 0) + 1,
      workingUkDays: (existing?.workingUkDays ?? 0) + (day.isWorkingDay ? 1 : 0),
    });
  }

  return Array.from(monthMap.values()).sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
}
