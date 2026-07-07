import {
  getTaxYearBounds,
  getTaxYearForDate,
  expandDateRange,
  isWeekday,
  isSameDay,
  formatDate,
} from '../../src/utils/DateUtils';

describe('getTaxYearBounds', () => {
  it('returns correct bounds for tax year 2025', () => {
    const bounds = getTaxYearBounds(2025, 6, 4);
    expect(bounds.start).toEqual(new Date(2025, 3, 6)); // 6 April 2025
    expect(bounds.end).toEqual(new Date(2026, 3, 5));   // 5 April 2026
  });

  it('returns correct bounds for tax year 2024', () => {
    const bounds = getTaxYearBounds(2024, 6, 4);
    expect(bounds.start).toEqual(new Date(2024, 3, 6));
    expect(bounds.end).toEqual(new Date(2025, 3, 5));
  });
});

describe('getTaxYearForDate', () => {
  it('returns current year for a date on the tax year start date', () => {
    expect(getTaxYearForDate(new Date(2025, 3, 6), 6, 4)).toBe(2025);
  });

  it('returns current year for a date after the tax year start', () => {
    expect(getTaxYearForDate(new Date(2025, 11, 31), 6, 4)).toBe(2025);
  });

  it('returns previous year for the day before the tax year start', () => {
    expect(getTaxYearForDate(new Date(2025, 3, 5), 6, 4)).toBe(2024);
  });

  it('returns previous year for 1 January', () => {
    expect(getTaxYearForDate(new Date(2025, 0, 1), 6, 4)).toBe(2024);
  });

  it('returns correct year on 6 April of a new year', () => {
    expect(getTaxYearForDate(new Date(2026, 3, 6), 6, 4)).toBe(2026);
  });
});

describe('expandDateRange', () => {
  it('returns a single date when start equals end', () => {
    const dates = expandDateRange(new Date(2025, 3, 10), new Date(2025, 3, 10));
    expect(dates).toHaveLength(1);
    expect(isSameDay(dates[0] as Date, new Date(2025, 3, 10))).toBe(true);
  });

  it('returns three dates for a three-day range', () => {
    const dates = expandDateRange(new Date(2025, 3, 6), new Date(2025, 3, 8));
    expect(dates).toHaveLength(3);
  });

  it('returns an empty array when end is before start', () => {
    const dates = expandDateRange(new Date(2025, 3, 8), new Date(2025, 3, 6));
    expect(dates).toHaveLength(0);
  });

  it('correctly expands across a month boundary', () => {
    const dates = expandDateRange(new Date(2025, 3, 30), new Date(2025, 4, 2));
    expect(dates).toHaveLength(3);
  });

  it('correctly handles a leap year February', () => {
    // 28 Feb 2024 → 1 Mar 2024 = 3 days (includes 29 Feb)
    const dates = expandDateRange(new Date(2024, 1, 28), new Date(2024, 2, 1));
    expect(dates).toHaveLength(3);
  });

  it('returns dates without a time component', () => {
    const dates = expandDateRange(new Date(2025, 3, 7), new Date(2025, 3, 7));
    expect(dates[0]?.getHours()).toBe(0);
    expect(dates[0]?.getMinutes()).toBe(0);
    expect(dates[0]?.getSeconds()).toBe(0);
  });
});

describe('isWeekday', () => {
  it('returns true for Monday', () => {
    expect(isWeekday(new Date(2025, 3, 7))).toBe(true);   // Mon 7 Apr 2025
  });

  it('returns true for Friday', () => {
    expect(isWeekday(new Date(2025, 3, 11))).toBe(true);  // Fri 11 Apr 2025
  });

  it('returns false for Saturday', () => {
    expect(isWeekday(new Date(2025, 3, 12))).toBe(false); // Sat 12 Apr 2025
  });

  it('returns false for Sunday', () => {
    expect(isWeekday(new Date(2025, 3, 13))).toBe(false); // Sun 13 Apr 2025
  });
});

describe('formatDate', () => {
  it('formats single-digit month and day with leading zeros', () => {
    expect(formatDate(new Date(2025, 0, 5))).toBe('2025-01-05');
  });

  it('formats a year-end date correctly', () => {
    expect(formatDate(new Date(2025, 11, 31))).toBe('2025-12-31');
  });

  it('formats the tax year start date correctly', () => {
    expect(formatDate(new Date(2025, 3, 6))).toBe('2025-04-06');
  });
});
