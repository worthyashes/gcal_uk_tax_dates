import { computeSummary } from '../../src/tax/TaxYearCalculator';
import { TaxDay } from '../../src/models/TaxDay';
import { Country } from '../../src/models/Country';
import { DEFAULT_SETTINGS } from '../../src/config/Settings';
import { getTaxYearBounds } from '../../src/utils/DateUtils';

const bounds = getTaxYearBounds(
  2025,
  DEFAULT_SETTINGS.taxYearStartDay,
  DEFAULT_SETTINGS.taxYearStartMonth
);

function makeUkDay(date: Date, isWorkingDay: boolean): TaxDay {
  return {
    date,
    country: Country.UnitedKingdom,
    isWorkingDay,
    sourceEventTitle: 'Test',
    notes: '',
  };
}

/** Creates `count` UK days starting from 6 April 2025. */
function makeUkDays(count: number, isWorkingDay: boolean): TaxDay[] {
  return Array.from({ length: count }, (_, i) =>
    makeUkDay(new Date(2025, 3, 6 + i), isWorkingDay)
  );
}

describe('computeSummary — basic counts', () => {
  it('returns zero UK days for empty input', () => {
    const summary = computeSummary([], bounds, DEFAULT_SETTINGS);
    expect(summary.totalUkDays).toBe(0);
    expect(summary.workingUkDays).toBe(0);
  });

  it('returns Safe status and 90-day limit for zero days', () => {
    const summary = computeSummary([], bounds, DEFAULT_SETTINGS);
    expect(summary.effectiveLimit).toBe(90);
    expect(summary.remainingDays).toBe(90);
    expect(summary.status).toBe('Safe');
  });

  it('counts only UK days and ignores Jersey days', () => {
    const jerseyDay: TaxDay = {
      date: new Date(2025, 3, 6),
      country: Country.Jersey,
      isWorkingDay: false,
      sourceEventTitle: 'Home',
      notes: '',
    };
    const ukDay = makeUkDay(new Date(2025, 3, 7), false);
    const summary = computeSummary([jerseyDay, ukDay], bounds, DEFAULT_SETTINGS);
    expect(summary.totalUkDays).toBe(1);
  });
});

describe('computeSummary — two-tier limit rule', () => {
  it('keeps 90-day effective limit when working days are exactly at the threshold', () => {
    const days = makeUkDays(30, true); // exactly 30 working days
    const summary = computeSummary(days, bounds, DEFAULT_SETTINGS);
    expect(summary.workingUkDays).toBe(30);
    expect(summary.effectiveLimit).toBe(90);
  });

  it('reduces effective limit to 60 when working days exceed 30', () => {
    const days = makeUkDays(31, true); // 31 working days
    const summary = computeSummary(days, bounds, DEFAULT_SETTINGS);
    expect(summary.workingUkDays).toBe(31);
    expect(summary.effectiveLimit).toBe(60);
  });

  it('correctly mixes working and non-working days in totals', () => {
    const working = makeUkDays(10, true);
    const nonWorking = makeUkDays(5, false).map((d, i) => ({
      ...d,
      date: new Date(2025, 4, 1 + i), // May dates to avoid overlap
    }));
    const summary = computeSummary([...working, ...nonWorking], bounds, DEFAULT_SETTINGS);
    expect(summary.totalUkDays).toBe(15);
    expect(summary.workingUkDays).toBe(10);
  });
});

describe('computeSummary — status', () => {
  it('returns Safe when well below the limit', () => {
    const summary = computeSummary(makeUkDays(50, false), bounds, DEFAULT_SETTINGS);
    expect(summary.status).toBe('Safe');
  });

  it('returns Warning when within the warning threshold', () => {
    // 82 days used, limit = 90, threshold = 10 → 82 >= 80 → Warning
    const summary = computeSummary(makeUkDays(82, false), bounds, DEFAULT_SETTINGS);
    expect(summary.status).toBe('Warning');
  });

  it('returns Over Limit when total days reach the effective limit', () => {
    const summary = computeSummary(makeUkDays(90, false), bounds, DEFAULT_SETTINGS);
    expect(summary.status).toBe('Over Limit');
    expect(summary.remainingDays).toBe(0);
  });

  it('returns Over Limit when total days exceed the reduced 60-day limit', () => {
    // 31 working days → effective limit = 60
    const workingDays = makeUkDays(31, true);
    const extraDays = Array.from({ length: 30 }, (_, i) =>
      makeUkDay(new Date(2025, 5, 1 + i), false) // June dates
    );
    const summary = computeSummary([...workingDays, ...extraDays], bounds, DEFAULT_SETTINGS);
    expect(summary.effectiveLimit).toBe(60);
    expect(summary.totalUkDays).toBe(61);
    expect(summary.status).toBe('Over Limit');
    expect(summary.remainingDays).toBe(0);
  });
});

describe('computeSummary — tax year bounds', () => {
  it('includes the correct tax year start date', () => {
    const summary = computeSummary([], bounds, DEFAULT_SETTINGS);
    expect(summary.taxYearStart).toEqual(new Date(2025, 3, 6)); // 6 April 2025
  });

  it('includes the correct tax year end date', () => {
    const summary = computeSummary([], bounds, DEFAULT_SETTINGS);
    expect(summary.taxYearEnd).toEqual(new Date(2026, 3, 5)); // 5 April 2026
  });
});
