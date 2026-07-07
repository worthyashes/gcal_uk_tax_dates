import { CalendarEvent } from '../models/CalendarEvent';
import { ICalendarService } from './CalendarService';
import { Settings } from '../config/Settings';
import { ILogger } from '../utils/Logger';

/** Reads events from all configured calendars. */
export interface IEventReader {
  readAllEvents(start: Date, end: Date): CalendarEvent[];
}

/**
 * Reads events from all calendars listed in Settings (UK, Jersey, and primary).
 * Duplicate events from multiple calendar sources are retained — deduplication
 * of calendar days is handled downstream by DayCounter.
 */
export class EventReader implements IEventReader {
  constructor(
    private readonly calendarService: ICalendarService,
    private readonly settings: Settings,
    private readonly logger: ILogger
  ) {}

  readAllEvents(start: Date, end: Date): CalendarEvent[] {
    const calendarNames = this.buildCalendarList();
    const allEvents: CalendarEvent[] = [];

    for (const name of calendarNames) {
      const events = this.calendarService.getEventsBetween(name, start, end);
      this.logger.info(`Read ${events.length} event(s) from "${name}"`);
      allEvents.push(...events);
    }

    return allEvents;
  }

  private buildCalendarList(): string[] {
    const names = new Set<string>([
      'primary',
      ...this.settings.ukCalendarNames,
      ...this.settings.jerseyCalendarNames,
    ]);
    return Array.from(names);
  }
}
