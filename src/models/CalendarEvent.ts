/**
 * Represents a single event read from Google Calendar.
 * This is the domain model — it does not reference any Google API types.
 */
export interface CalendarEvent {
  readonly title: string;
  readonly location: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly isAllDay: boolean;
  /** The name of the Google Calendar this event was read from. */
  readonly calendarName: string;
}
