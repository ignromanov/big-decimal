/**
 * Error codes for BigDecimal operations
 */
export const BigDecimalErrorCodes = {
  /** Invalid input value format */
  INVALID_FORMAT: "INVALID_FORMAT",
  /** Value out of supported range */
  OUT_OF_RANGE: "OUT_OF_RANGE",
  /** Invalid operation (e.g., division by zero) */
  INVALID_OPERATION: "INVALID_OPERATION",
  /** Invalid configuration */
  INVALID_CONFIG: "INVALID_CONFIG",
  /** Invalid argument type */
  INVALID_ARGUMENT: "INVALID_ARGUMENT",
} as const;

export type BigDecimalErrorCode =
  (typeof BigDecimalErrorCodes)[keyof typeof BigDecimalErrorCodes];
