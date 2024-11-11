export const BigDecimalErrorCode = {
  INVALID_VALUE: "INVALID_VALUE",
  INVALID_BASE: "INVALID_BASE",
  INVALID_EXPONENT: "INVALID_EXPONENT",
  INVALID_SIGN: "INVALID_SIGN",
  DIVISION_BY_ZERO: "DIVISION_BY_ZERO",
  INVALID_OPERATION: "INVALID_OPERATION",
  PRECISION_LOSS: "PRECISION_LOSS",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  SPECIAL_VALUE: "SPECIAL_VALUE",
  INVALID_CONFIG: "INVALID_CONFIG",
} as const;

export type BigDecimalErrorCode =
  (typeof BigDecimalErrorCode)[keyof typeof BigDecimalErrorCode];
