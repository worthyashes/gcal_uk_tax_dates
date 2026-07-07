/**
 * The inclusive start and end dates of a UK tax year.
 */
export interface TaxYearBounds {
  readonly start: Date;
  readonly end: Date;
}

/**
 * Returns the tax year start and end dates for the given year number.
 * The UK tax year runs from startDay/startMonth/year to (startDay-1)/startMonth/(year+1).
 *
 * @example getTaxYearBounds(2025, 6, 4) → { start: 6 Apr 2025, end: 5 Apr 2026 }
 */
export function getTaxYearBounds(
  year: number,
  startDay: number,
  startMonth: number
): TaxYearBounds {
  const start = new Date(year, startMonth - 1, startDay);
  const end = new Date(year + 1, startMonth - 1, startDay - 1);
  return { start, end };
}

/**
 * Returns the tax year number that a given date falls in.
 * Dates before the tax year start day/month belong to the previous year's tax year.
 */
export function getTaxYearForDate(
  date: Date,
  startDay: number,
  startMonth: number
): number {
  const year = date.getFullYear();
  const taxYearStart = new Date(year, startMonth - 1, startDay);
  return date >= taxYearStart ? year : year - 1;
}

/**
 * Returns all calendar dates (inclusive) between startDate and endDate.
 * Returns an empty array if startDate is after endDate.
 */
export function expandDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = normaliseDate(startDate);
  const end = normaliseDate(endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Strips the time component from a Date, returning midnight in local time.
 */
export function normaliseDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Returns true if the given date is a weekday (Monday–Friday).
 */
export function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

/**
 * Returns true if two dates represent the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Formats a Date as an ISO date string (YYYY-MM-DD).
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the full English month name for a zero-based month index (0 = January).
 */
export function getMonthName(month: number): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month] ?? 'Unknown';
}
