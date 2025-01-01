import { BigDecimal } from "@/core";
import { BigDecimalErrors } from "@/old-src/errors";

/**
 * Validates sign for decimal numbers
 */
export function validateSign(sign: 1 | -1 | null): asserts sign is 1 | -1 {
  if (sign !== 1 && sign !== -1 && sign !== null) {
    throw BigDecimalErrors.invalidSign(sign);
  }
}

/**
 * Validates raw values for creating a BigDecimal instance
 */
export function validateRawValues(
  value: bigint,
  base: number,
  sign: 1 | -1
): void {
  if (value < 0n) {
    throw BigDecimalErrors.invalidValue(value, { base });
  }
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw BigDecimalErrors.invalidBase(base, { value });
  }
  if (sign !== 1 && sign !== -1 && sign !== null) {
    throw BigDecimalErrors.invalidSign(sign);
  }
}

/**
 * Checks if a value is valid for creating a BigDecimal instance
 */
export function isValidValue(value: unknown): boolean {
  if (value instanceof BigDecimal) return true;
  if (typeof value === "string") {
    return (
      DECIMAL_STRING_REGEX.test(value) || SCIENTIFIC_NOTATION_REGEX.test(value)
    );
  }
  if (typeof value === "number") return true;
  if (typeof value === "bigint") return true;
  return false;
}

// Regular expressions for string validation
const DECIMAL_STRING_REGEX = /^[+-]?(\d*\.?\d+|\d+\.)$/;
const SCIENTIFIC_NOTATION_REGEX = /^[+-]?(\d*\.?\d+|\d+\.)[eE][+-]?\d+$/;
