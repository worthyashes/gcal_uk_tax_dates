import { TaxDay } from '../models/TaxDay';
import { Country } from '../models/Country';
import { TaxStatus, TaxSummary } from '../models/TaxSummary';
import { Settings } from '../config/Settings';
import { TaxYearBounds } from '../utils/DateUtils';

/**
 * Computes a TaxSummary from classified TaxDay records.
 *
 * Two-tier limit rule applied:
 *   - If workingUkDays > workingDayLimit (default 30):
 *       effectiveLimit = reducedTotalDayLimit (default 60)
 *   - Otherwise:
 *       effectiveLimit = totalDayLimit (default 90)
 */
export function computeSummary(
  taxDays: readonly TaxDay[],
  bounds: TaxYearBounds,
  settings: Settings
): TaxSummary {
  const ukDays = taxDays.filter((d) => d.country === Country.UnitedKingdom);
  const totalUkDays = ukDays.length;
  const workingUkDays = ukDays.filter((d) => d.isWorkingDay).length;

  const effectiveLimit =
    workingUkDays > settings.workingDayLimit
      ? settings.reducedTotalDayLimit
      : settings.totalDayLimit;

  const remainingDays = Math.max(0, effectiveLimit - totalUkDays);
  const status = deriveStatus(totalUkDays, effectiveLimit, settings.warningThreshold);

  return {
    taxYearStart: bounds.start,
    taxYearEnd: bounds.end,
    totalUkDays,
    workingUkDays,
    totalDayLimit: settings.totalDayLimit,
    workingDayLimit: settings.workingDayLimit,
    effectiveLimit,
    remainingDays,
    status,
    warningThreshold: settings.warningThreshold,
  };
}

function deriveStatus(
  daysUsed: number,
  effectiveLimit: number,
  warningThreshold: number
): TaxStatus {
  if (daysUsed >= effectiveLimit) return 'Over Limit';
  if (daysUsed >= effectiveLimit - warningThreshold) return 'Warning';
  return 'Safe';
}
