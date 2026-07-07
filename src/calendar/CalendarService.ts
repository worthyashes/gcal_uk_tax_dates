import { CalendarEvent } from '../models/CalendarEvent';
import { ILogger } from '../utils/Logger';
import { normaliseDate } from '../utils/DateUtils';

/**
 * Reads events from Google Calendar.
 * This is the only file that calls CalendarApp — all GAS API access is isolated here.
 */
export interface ICalendarService {
  getEventsBetween(calendarName: string, start: Date, end: Date): CalendarEvent[];
}

/**
 * Wraps CalendarApp to read events from named Google Calendars.
 * Returns an empty array (rather than throwing) for missing or unreadable calendars.
 */
export class CalendarService implements ICalendarService {
  constructor(private readonly logger: ILogger) {}

  getEventsBetween(calendarName: string, start: Date, end: Date): CalendarEvent[] {
    const calendar = this.findCalendar(calendarName);
    if (!calendar) {
      this.logger.warn(`Calendar not found: "${calendarName}"`);
      return [];
    }

    try {
      const gasEvents = calendar.getEvents(start, end);
      return gasEvents.map((e) => this.mapEvent(e, calendarName));
    } catch {
      this.logger.error(`Failed to read events from calendar: "${calendarName}"`);
      return [];
    }
  }

  private findCalendar(
    name: string
  ): GoogleAppsScript.Calendar.Calendar | null {
    try {
      if (name === 'primary') {
        return CalendarApp.getDefaultCalendar();
      }
      const calendars = CalendarApp.getCalendarsByName(name);
      return calendars.length > 0 ? (calendars[0] ?? null) : null;
    } catch {
      return null;
    }
  }

  private mapEvent(
    event: GoogleAppsScript.Calendar.CalendarEvent,
    calendarName: string
  ): CalendarEvent {
    const isAllDay = event.isAllDayEvent();

    if (isAllDay) {
      // GAS getAllDayEndDate() returns the exclusive end date (day after last day).
      // Use getTime() to convert GoogleAppsScript.Base.Date → native Date safely.
      const exclusiveEnd = this.toNativeDate(event.getAllDayEndDate());
      const inclusiveEnd = new Date(exclusiveEnd.getTime());
      inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);

      return {
        title: event.getTitle(),
        location: event.getLocation(),
        startDate: normaliseDate(this.toNativeDate(event.getAllDayStartDate())),
        endDate: normaliseDate(inclusiveEnd),
        isAllDay: true,
        calendarName,
      };
    }

    return {
      title: event.getTitle(),
      location: event.getLocation(),
      startDate: normaliseDate(this.toNativeDate(event.getStartTime())),
      endDate: normaliseDate(this.toNativeDate(event.getEndTime())),
      isAllDay: false,
      calendarName,
    };
  }

  /** Converts a GoogleAppsScript.Base.Date to a native JS Date via getTime(). */
  private toNativeDate(gasDate: GoogleAppsScript.Base.Date): Date {
    return new Date(gasDate.getTime());
  }
}
