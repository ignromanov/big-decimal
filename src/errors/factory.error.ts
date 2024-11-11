import { BigDecimalError } from "./decimal.error";
import { BigDecimalErrorCode } from "./codes.error";
import type { ErrorDetails } from "./types.error";

const formatValue = (value: unknown): string => {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (value === "") return "(empty string)";
  if (typeof value === "string" && value.trim() === "") return "(whitespace)";
  return String(value);
};

const formatPair = (value: string, base: string): string => {
  return `"${value}, ${base}"`;
};

export const BigDecimalErrors = {
  invalidValue(value: unknown, details?: ErrorDetails) {
    const formattedValue = formatValue(value);
    const baseInfo =
      details?.base !== undefined ? formatValue(details.base) : "";
    return new BigDecimalError(
      `Invalid value (value, base): ${formatPair(formattedValue, baseInfo)}`,
      BigDecimalErrorCode.INVALID_VALUE,
      {
        received: value,
        ...details,
      }
    );
  },

  invalidBase(base: number, details?: ErrorDetails) {
    const value =
      details?.value !== undefined ? formatValue(details.value) : "";
    return new BigDecimalError(
      `Base must be an integer between 2 and 36 (value, base): ${formatPair(
        value || "-",
        formatValue(base)
      )}`,
      BigDecimalErrorCode.INVALID_BASE,
      {
        expected: "integer between 2 and 36",
        received: base,
        ...details,
      }
    );
  },

  invalidExponent(exp: number, details?: ErrorDetails) {
    const value =
      details?.value !== undefined ? formatValue(details.value) : "";
    return new BigDecimalError(
      `Invalid exponent (value, exp): ${formatPair(
        value || "-",
        formatValue(exp)
      )}`,
      BigDecimalErrorCode.INVALID_EXPONENT,
      {
        received: exp,
        ...details,
      }
    );
  },

  invalidSign(sign: unknown, details?: ErrorDetails) {
    return new BigDecimalError(
      `Sign must be either -1 or 1, received: ${formatValue(sign)}`,
      BigDecimalErrorCode.INVALID_SIGN,
      {
        expected: "[-1, 1]",
        received: sign,
        ...details,
      }
    );
  },

  divisionByZero(details?: ErrorDetails) {
    return new BigDecimalError(
      "Division by zero is not allowed",
      BigDecimalErrorCode.DIVISION_BY_ZERO,
      details
    );
  },

  invalidOperation(message: string, details?: ErrorDetails) {
    return new BigDecimalError(
      `Invalid operation: ${message}`,
      BigDecimalErrorCode.INVALID_OPERATION,
      details
    );
  },

  precisionLoss(message: string, details?: ErrorDetails) {
    return new BigDecimalError(
      `Precision loss detected: ${message}`,
      BigDecimalErrorCode.PRECISION_LOSS,
      details
    );
  },

  notImplemented(methodName: string, details?: ErrorDetails) {
    return new BigDecimalError(
      `Method "${methodName}" is not implemented`,
      BigDecimalErrorCode.NOT_IMPLEMENTED,
      details
    );
  },

  specialValue(value: string, details?: ErrorDetails) {
    return new BigDecimalError(
      `Special value ${formatValue(value)} is not allowed in BigDecimal`,
      BigDecimalErrorCode.SPECIAL_VALUE,
      details
    );
  },

  invalidConfig(message: string, details?: ErrorDetails) {
    return new BigDecimalError(
      `Invalid configuration: ${message}`,
      BigDecimalErrorCode.INVALID_CONFIG,
      details
    );
  },
} as const;
