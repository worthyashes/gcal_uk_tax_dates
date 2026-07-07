/**
 * Application configuration settings.
 * Adjust DEFAULT_SETTINGS to match your Google Calendar names and preferences.
 */
export interface Settings {
  /** Names of Google Calendars that record UK visits. */
  readonly ukCalendarNames: readonly string[];
  /** Names of Google Calendars that record Jersey / home time. */
  readonly jerseyCalendarNames: readonly string[];
  /** Location keywords that indicate a UK event (case-insensitive). */
  readonly ukLocationKeywords: readonly string[];
  /** Location keywords that indicate a Jersey event (case-insensitive). */
  readonly jerseyLocationKeywords: readonly string[];
  /** Event title keywords that indicate a UK event (case-insensitive). */
  readonly ukTitleKeywords: readonly string[];
  /**
   * Title keywords that mark a day as non-working (case-insensitive).
   * If any event on a UK weekday contains one of these, the day is not a working day.
   */
  readonly workingDayExclusions: readonly string[];
  /** Maximum total UK days before residency risk. Default: 90. */
  readonly totalDayLimit: number;
  /**
   * Working day threshold. If exceeded, the total day limit is reduced.
   * Default: 30.
   */
  readonly workingDayLimit: number;
  /** Reduced total day limit applied when workingDayLimit is exceeded. Default: 60. */
  readonly reducedTotalDayLimit: number;
  /** Days before effectiveLimit at which Warning status is shown. Default: 10. */
  readonly warningThreshold: number;
  /** Day of month on which the UK tax year starts. Default: 6. */
  readonly taxYearStartDay: number;
  /** Month (1–12) on which the UK tax year starts. Default: 4 (April). */
  readonly taxYearStartMonth: number;
  /** Google Spreadsheet ID. Leave empty to use the active spreadsheet. */
  readonly spreadsheetId: string;
  /** IANA time zone identifier. */
  readonly timeZone: string;
}

/** Default settings for a Jersey resident tracking UK days. */
export const DEFAULT_SETTINGS: Settings = {
  ukCalendarNames: ['UK', 'United Kingdom', 'UK Visits', 'UK Work', 'Work'],
  jerseyCalendarNames: ['Jersey', 'Home', 'Personal'],
  ukLocationKeywords: [
    'United Kingdom',
    'UK',
    'England',
    'Scotland',
    'Wales',
    'London',
    'Manchester',
    'Birmingham',
    'Bristol',
    'Edinburgh',
    'Glasgow',
  ],
  jerseyLocationKeywords: ['Jersey', 'Channel Islands', 'St Helier'],
  ukTitleKeywords: ['UK', 'United Kingdom', 'London', 'England', 'Scotland', 'Wales'],
  workingDayExclusions: [
    'holiday',
    'annual leave',
    'leave',
    'day off',
    'off',
    'vacation',
    'bank holiday',
    'public holiday',
  ],
  totalDayLimit: 90,
  workingDayLimit: 30,
  reducedTotalDayLimit: 60,
  warningThreshold: 10,
  taxYearStartDay: 6,
  taxYearStartMonth: 4,
  spreadsheetId: '',
  timeZone: 'Europe/London',
};
