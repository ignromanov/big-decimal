import { BigDecimalErrorCode } from "./error-codes";

/**
 * Base error class for BigDecimal operations
 */
export class BigDecimalError extends Error {
  /**
   * Creates a new BigDecimal error
   * @param message - Error message
   * @param code - Error code
   * @param details - Additional error details
   */
  constructor(
    message: string,
    public readonly code: BigDecimalErrorCode,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "BigDecimalError";
  }

  /**
   * Formats a value for error message
   */
  private static formatValue(value: unknown): string {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (value === "") return "(empty string)";
    if (typeof value === "string" && value.trim() === "") return "(whitespace)";
    return String(value);
  }

  /**
   * Formats a pair of values for error message
   */
  private static formatPair(value: string, base: string): string {
    return `"${value}, ${base}"`;
  }

  /**
   * Creates an error for invalid input format
   */
  static invalidFormat(
    value: unknown,
    details?: Record<string, unknown>
  ): BigDecimalError {
    const formattedValue = this.formatValue(value);
    const baseInfo =
      details?.base !== undefined ? this.formatValue(details.base) : "";
    return new BigDecimalError(
      `Invalid format: cannot parse (value, base): ${this.formatPair(
        formattedValue,
        baseInfo
      )}`,
      "INVALID_FORMAT",
      { value, ...details }
    );
  }

  /**
   * Creates an error for value out of supported range
   */
  static outOfRange(
    value: unknown,
    details?: Record<string, unknown>
  ): BigDecimalError {
    return new BigDecimalError("Value out of supported range", "OUT_OF_RANGE", {
      value,
      ...details,
    });
  }

  /**
   * Creates an error for invalid operation
   */
  static invalidOperation(
    operation: string,
    details?: Record<string, unknown>
  ): BigDecimalError {
    return new BigDecimalError(
      `Invalid operation: ${operation}`,
      "INVALID_OPERATION",
      details
    );
  }

  /**
   * Creates an error for invalid configuration
   */
  static invalidConfig(
    message: string,
    details?: Record<string, unknown>
  ): BigDecimalError {
    return new BigDecimalError(
      `Invalid configuration: ${message}`,
      "INVALID_CONFIG",
      details
    );
  }

  /**
   * Creates an error for invalid argument
   */
  static invalidArgument(
    message: string,
    details?: Record<string, unknown>
  ): BigDecimalError {
    return new BigDecimalError(
      `Invalid argument: ${message}`,
      "INVALID_ARGUMENT",
      details
    );
  }
}
