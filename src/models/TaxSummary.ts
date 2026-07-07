/**
 * The compliance status relative to the effective day limit.
 */
export type TaxStatus = 'Safe' | 'Warning' | 'Over Limit';

/**
 * A computed summary of UK tax days for a given tax year.
 */
export interface TaxSummary {
  /** Start date of the tax year (inclusive). */
  readonly taxYearStart: Date;
  /** End date of the tax year (inclusive). */
  readonly taxYearEnd: Date;
  /** Total calendar days spent in the UK. */
  readonly totalUkDays: number;
  /** UK weekdays not marked as leave or holiday. */
  readonly workingUkDays: number;
  /** Configured base total day limit (default: 90). */
  readonly totalDayLimit: number;
  /** Configured working day threshold (default: 30). */
  readonly workingDayLimit: number;
  /**
   * Effective total day limit after applying the working day rule.
   * Equals reducedTotalDayLimit (60) when workingUkDays > workingDayLimit,
   * otherwise equals totalDayLimit (90).
   */
  readonly effectiveLimit: number;
  /** Days remaining before reaching the effective limit (minimum 0). */
  readonly remainingDays: number;
  /** Current compliance status. */
  readonly status: TaxStatus;
  /** Days before the limit at which Warning status is triggered. */
  readonly warningThreshold: number;
}
