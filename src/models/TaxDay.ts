import { Country } from './Country';

/**
 * Represents a single calendar day relevant to the tax calculation.
 * Each TaxDay carries a country classification and a working day flag.
 */
export interface TaxDay {
  readonly date: Date;
  readonly country: Country;
  /** True if this is a UK weekday not marked as leave or holiday. */
  readonly isWorkingDay: boolean;
  readonly sourceEventTitle: string;
  readonly notes: string;
}
