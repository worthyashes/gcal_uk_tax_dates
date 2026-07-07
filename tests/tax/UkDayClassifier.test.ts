import { UkDayClassifier } from '../../src/tax/UkDayClassifier';
import { Country } from '../../src/models/Country';
import { CalendarEvent } from '../../src/models/CalendarEvent';
import { DEFAULT_SETTINGS } from '../../src/config/Settings';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    title: 'Test Event',
    location: '',
    startDate: new Date(2025, 3, 7),
    endDate: new Date(2025, 3, 7),
    isAllDay: true,
    calendarName: 'Other Calendar',
    ...overrides,
  };
}

describe('UkDayClassifier.classifyEvent — calendar name priority', () => {
  const classifier = new UkDayClassifier(DEFAULT_SETTINGS);

  it('classifies a UK-named calendar as UnitedKingdom', () => {
    expect(classifier.classifyEvent(makeEvent({ calendarName: 'UK' }))).toBe(
      Country.UnitedKingdom
    );
  });

  it('classifies a Jersey-named calendar as Jersey', () => {
    expect(classifier.classifyEvent(makeEvent({ calendarName: 'Jersey' }))).toBe(
      Country.Jersey
    );
  });

  it('UK calendar name takes priority over Jersey location', () => {
    const event = makeEvent({ calendarName: 'UK', location: 'St Helier, Jersey' });
    expect(classifier.classifyEvent(event)).toBe(Country.UnitedKingdom);
  });
});

describe('UkDayClassifier.classifyEvent — location keywords', () => {
  const classifier = new UkDayClassifier(DEFAULT_SETTINGS);

  it('classifies a London location as UnitedKingdom', () => {
    expect(
      classifier.classifyEvent(makeEvent({ location: 'London, UK' }))
    ).toBe(Country.UnitedKingdom);
  });

  it('classifies a Jersey location as Jersey', () => {
    expect(
      classifier.classifyEvent(makeEvent({ location: 'St Helier, Jersey' }))
    ).toBe(Country.Jersey);
  });

  it('location match is case-insensitive', () => {
    expect(
      classifier.classifyEvent(makeEvent({ location: 'LONDON' }))
    ).toBe(Country.UnitedKingdom);
  });
});

describe('UkDayClassifier.classifyEvent — title keywords', () => {
  const classifier = new UkDayClassifier(DEFAULT_SETTINGS);

  it('classifies an event with "London" in the title as UnitedKingdom', () => {
    expect(
      classifier.classifyEvent(makeEvent({ title: 'Trip to London' }))
    ).toBe(Country.UnitedKingdom);
  });

  it('classifies an unknown event as Other', () => {
    expect(
      classifier.classifyEvent(makeEvent({ title: 'Dentist', location: 'Paris' }))
    ).toBe(Country.Other);
  });
});

describe('UkDayClassifier.isWorkingDayInUk', () => {
  const classifier = new UkDayClassifier(DEFAULT_SETTINGS);

  const monday = new Date(2025, 3, 7);   // Mon 7 Apr 2025
  const saturday = new Date(2025, 3, 12); // Sat 12 Apr 2025
  const sunday = new Date(2025, 3, 13);  // Sun 13 Apr 2025
  const tuesday = new Date(2025, 3, 8);  // Tue 8 Apr 2025

  it('returns true for a weekday with no exclusion events', () => {
    expect(
      classifier.isWorkingDayInUk(monday, [makeEvent({ title: 'UK Meeting' })])
    ).toBe(true);
  });

  it('returns false for Saturday', () => {
    expect(classifier.isWorkingDayInUk(saturday, [])).toBe(false);
  });

  it('returns false for Sunday', () => {
    expect(classifier.isWorkingDayInUk(sunday, [])).toBe(false);
  });

  it('returns false when an event has "holiday" in the title', () => {
    expect(
      classifier.isWorkingDayInUk(monday, [makeEvent({ title: 'Bank Holiday' })])
    ).toBe(false);
  });

  it('returns false when an event has "annual leave" in the title', () => {
    expect(
      classifier.isWorkingDayInUk(tuesday, [makeEvent({ title: 'Annual Leave' })])
    ).toBe(false);
  });

  it('returns false when an event has "day off" in the title', () => {
    expect(
      classifier.isWorkingDayInUk(monday, [makeEvent({ title: 'Day Off' })])
    ).toBe(false);
  });

  it('exclusion keyword matching is case-insensitive', () => {
    expect(
      classifier.isWorkingDayInUk(monday, [makeEvent({ title: 'HOLIDAY' })])
    ).toBe(false);
  });

  it('returns true for a weekday when no event contains an exclusion keyword', () => {
    expect(
      classifier.isWorkingDayInUk(monday, [makeEvent({ title: 'Stand-up Meeting' })])
    ).toBe(true);
  });
});
