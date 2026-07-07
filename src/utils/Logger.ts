/** Structured logger interface for dependency injection. */
export interface ILogger {
  info(message: string, data?: object): void;
  warn(message: string, data?: object): void;
  error(message: string, data?: object): void;
}

/**
 * Concrete logger that writes structured output to the console.
 * Compatible with both GAS V8 (Stackdriver) and Node.js test environments.
 */
export class AppLogger implements ILogger {
  private readonly enabled: boolean;
  private readonly prefix: string;

  constructor(enabled = true, prefix = '[UkTaxTracker]') {
    this.enabled = enabled;
    this.prefix = prefix;
  }

  info(message: string, data?: object): void {
    if (this.enabled) {
      console.log(`${this.prefix} INFO  ${message}`, data !== undefined ? data : '');
    }
  }

  warn(message: string, data?: object): void {
    if (this.enabled) {
      console.warn(`${this.prefix} WARN  ${message}`, data !== undefined ? data : '');
    }
  }

  error(message: string, data?: object): void {
    if (this.enabled) {
      console.error(`${this.prefix} ERROR ${message}`, data !== undefined ? data : '');
    }
  }
}

/** Creates a new AppLogger instance. */
export function createLogger(enabled = true): ILogger {
  return new AppLogger(enabled);
}
