import { DEFAULT_SETTINGS } from './config/Settings';
import { createLogger } from './utils/Logger';
import { getTaxYearBounds, getTaxYearForDate } from './utils/DateUtils';
import { CalendarService } from './calendar/CalendarService';
import { EventReader } from './calendar/EventReader';
import { UkDayClassifier } from './tax/UkDayClassifier';
import { DayCounter } from './tax/DayCounter';
import { computeSummary } from './tax/TaxYearCalculator';
import { generateReport, TaxReport } from './reports/ReportGenerator';
import { SheetExporter } from './reports/SheetExporter';

/**
 * Runs the full calculation pipeline for the current UK tax year.
 *
 * Flow: read calendar events → classify UK days → compute tax summary → export report.
 */
export function runCalculation(): TaxReport {
  const settings = DEFAULT_SETTINGS;
  const logger = createLogger(true);

  const calendarService = new CalendarService(logger);
  const eventReader = new EventReader(calendarService, settings, logger);
  const classifier = new UkDayClassifier(settings);
  const dayCounter = new DayCounter(classifier);

  const taxYear = getTaxYearForDate(
    new Date(),
    settings.taxYearStartDay,
    settings.taxYearStartMonth
  );
  const bounds = getTaxYearBounds(
    taxYear,
    settings.taxYearStartDay,
    settings.taxYearStartMonth
  );

  logger.info(`Calculating tax year ${taxYear}/${taxYear + 1}`);

  const events = eventReader.readAllEvents(bounds.start, bounds.end);
  logger.info(`Total events read: ${events.length}`);

  const taxDays = dayCounter.classifyDays(events);
  logger.info(`UK days found: ${taxDays.length}`);

  const summary = computeSummary(taxDays, bounds, settings);
  const report = generateReport(taxDays, summary);

  const exporter = new SheetExporter(settings.spreadsheetId, logger);
  exporter.exportReport(report);

  return report;
}
