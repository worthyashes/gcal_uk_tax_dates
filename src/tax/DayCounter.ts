import { CalendarEvent } from '../models/CalendarEvent';
import { Country } from '../models/Country';
import { TaxDay } from '../models/TaxDay';
import { IUkDayClassifier } from './UkDayClassifier';
import { expandDateRange, formatDate } from '../utils/DateUtils';

/**
 * Converts calendar events into deduplicated TaxDay records.
 *
 * Only UK days are returned. Each calendar day is counted at most once,
 * even if multiple events overlap on that day.
 *
 * Working day detection uses ALL provided events (not just UK events),
 * so a leave event in any calendar correctly marks a UK day as non-working.
 */
export class DayCounter {
  constructor(private readonly classifier: IUkDayClassifier) {}

  /**
   * Returns one TaxDay per unique UK calendar day found across all events.
   * Days are returned in ascending date order.
   */
  classifyDays(events: readonly CalendarEvent[]): TaxDay[] {
    const eventsByDate = this.buildEventsByDate(events);
    const ukDayMap = new Map<string, TaxDay>();

    for (const event of events) {
      if (this.classifier.classifyEvent(event) !== Country.UnitedKingdom) {
        continue;
      }

      for (const date of expandDateRange(event.startDate, event.endDate)) {
        const key = formatDate(date);
        if (ukDayMap.has(key)) continue;

        const eventsOnDay = eventsByDate.get(key) ?? [];
        ukDayMap.set(key, {
          date,
          country: Country.UnitedKingdom,
          isWorkingDay: this.classifier.isWorkingDayInUk(date, eventsOnDay),
          sourceEventTitle: event.title,
          notes: '',
        });
      }
    }

    return Array.from(ukDayMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }

  private buildEventsByDate(
    events: readonly CalendarEvent[]
  ): Map<string, CalendarEvent[]> {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      for (const day of expandDateRange(event.startDate, event.endDate)) {
        const key = formatDate(day);
        const existing = map.get(key) ?? [];
        map.set(key, [...existing, event]);
      }
    }
    return map;
  }
}
