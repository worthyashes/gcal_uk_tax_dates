import { CalendarEvent } from '../models/CalendarEvent';
import { Country } from '../models/Country';
import { Settings } from '../config/Settings';
import { isWeekday } from '../utils/DateUtils';

/** Classifies calendar events and determines working day status. */
export interface IUkDayClassifier {
  classifyEvent(event: CalendarEvent): Country;
  isWorkingDayInUk(date: Date, eventsOnDay: readonly CalendarEvent[]): boolean;
}

/**
 * Classifies events using a three-tier priority strategy:
 *   1. Calendar name match (highest priority)
 *   2. Event location keyword match
 *   3. Event title keyword match
 *
 * A UK weekday is a working day unless any event on that day contains a
 * configured exclusion keyword (e.g. "holiday", "annual leave").
 */
export class UkDayClassifier implements IUkDayClassifier {
  constructor(private readonly settings: Settings) {}

  classifyEvent(event: CalendarEvent): Country {
    if (this.matchesAny(event.calendarName, this.settings.ukCalendarNames)) {
      return Country.UnitedKingdom;
    }
    if (this.matchesAny(event.calendarName, this.settings.jerseyCalendarNames)) {
      return Country.Jersey;
    }
    if (this.matchesAny(event.location, this.settings.ukLocationKeywords)) {
      return Country.UnitedKingdom;
    }
    if (this.matchesAny(event.location, this.settings.jerseyLocationKeywords)) {
      return Country.Jersey;
    }
    if (this.matchesAny(event.title, this.settings.ukTitleKeywords)) {
      return Country.UnitedKingdom;
    }
    return Country.Other;
  }

  isWorkingDayInUk(date: Date, eventsOnDay: readonly CalendarEvent[]): boolean {
    if (!isWeekday(date)) {
      return false;
    }
    return !eventsOnDay.some((event) => this.containsExclusionKeyword(event.title));
  }

  private matchesAny(text: string, keywords: readonly string[]): boolean {
    const lowerText = text.toLowerCase();
    return keywords.some((k) => lowerText.includes(k.toLowerCase()));
  }

  private containsExclusionKeyword(title: string): boolean {
    const lowerTitle = title.toLowerCase();
    return this.settings.workingDayExclusions.some((kw) =>
      lowerTitle.includes(kw.toLowerCase())
    );
  }
}
