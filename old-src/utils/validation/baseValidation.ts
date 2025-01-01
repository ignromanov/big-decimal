import { BigDecimalErrors } from "@/old-src/errors";

type Base = number;

/**
 * Validates base parameter
 */
export function validateBase(base: number): asserts base is Base {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw BigDecimalErrors.invalidBase(base, {
      context: "base validation",
      expected: "integer between 2 and 36",
    });
  }
}

/**
 * Validates base for raw values
 */
export function validateRawBase(base: Base): asserts base is Base {
  validateBase(base);
}

/**
 * Checks if base is valid
 */
export function isValidBase(base: unknown): base is Base {
  return (
    typeof base === "number" &&
    Number.isInteger(base) &&
    base >= 2 &&
    base <= 36
  );
}
