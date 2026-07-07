import { DayCounter } from '../../src/tax/DayCounter';
import { UkDayClassifier } from '../../src/tax/UkDayClassifier';
import { Country } from '../../src/models/Country';
import { CalendarEvent } from '../../src/models/CalendarEvent';
import { DEFAULT_SETTINGS } from '../../src/config/Settings';

const classifier = new UkDayClassifier(DEFAULT_SETTINGS);
const counter = new DayCounter(classifier);

function makeUkEvent(start: Date, end: Date, title = 'UK Visit'): CalendarEvent {
  return {
    title,
    location: '',
    startDate: start,
    endDate: end,
    isAllDay: true,
    calendarName: 'UK',
  };
}

function makeJerseyEvent(start: Date, end: Date, title = 'Home'): CalendarEvent {
  return {
    title,
    location: '',
    startDate: start,
    endDate: end,
    isAllDay: true,
    calendarName: 'Jersey',
  };
}

describe('DayCounter.classifyDays — basic counting', () => {
  it('returns an empty array when there are no events', () => {
    expect(counter.classifyDays([])).toHaveLength(0);
  });

  it('returns one UK day for a single-day UK event', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)),
    ]);
    expect(days).toHaveLength(1);
    expect(days[0]?.country).toBe(Country.UnitedKingdom);
  });

  it('returns three UK days for a three-day UK event', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 9)),
    ]);
    expect(days).toHaveLength(3);
  });

  it('ignores non-UK events', () => {
    const days = counter.classifyDays([
      makeJerseyEvent(new Date(2025, 3, 7), new Date(2025, 3, 9)),
    ]);
    expect(days).toHaveLength(0);
  });
});

describe('DayCounter.classifyDays — deduplication', () => {
  it('deduplicates overlapping UK events to unique days', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 9)),  // Apr 7–9
      makeUkEvent(new Date(2025, 3, 8), new Date(2025, 3, 10)), // Apr 8–10
    ]);
    expect(days).toHaveLength(4); // Apr 7, 8, 9, 10
  });

  it('counts a day once even when two identical events exist', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)),
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)),
    ]);
    expect(days).toHaveLength(1);
  });
});

describe('DayCounter.classifyDays — working day detection', () => {
  it('marks a UK Monday as a working day when no exclusion event exists', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)), // Mon
    ]);
    expect(days[0]?.isWorkingDay).toBe(true);
  });

  it('marks a UK Saturday as not a working day', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 12), new Date(2025, 3, 12)), // Sat
    ]);
    expect(days[0]?.isWorkingDay).toBe(false);
  });

  it('marks a UK Monday as not working when a leave event falls on the same day', () => {
    const leaveEvent = makeJerseyEvent(
      new Date(2025, 3, 7),
      new Date(2025, 3, 7),
      'Annual Leave'
    );
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)),
      leaveEvent,
    ]);
    expect(days[0]?.isWorkingDay).toBe(false);
  });

  it('marks a UK Monday as not working when a holiday event exists', () => {
    const holidayEvent = makeJerseyEvent(
      new Date(2025, 3, 7),
      new Date(2025, 3, 7),
      'Bank Holiday'
    );
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)),
      holidayEvent,
    ]);
    expect(days[0]?.isWorkingDay).toBe(false);
  });
});

describe('DayCounter.classifyDays — ordering', () => {
  it('returns days sorted in ascending date order', () => {
    const days = counter.classifyDays([
      makeUkEvent(new Date(2025, 3, 9), new Date(2025, 3, 9)),
      makeUkEvent(new Date(2025, 3, 7), new Date(2025, 3, 7)),
    ]);
    expect(days[0]?.date.getDate()).toBe(7);
    expect(days[1]?.date.getDate()).toBe(9);
  });
});
