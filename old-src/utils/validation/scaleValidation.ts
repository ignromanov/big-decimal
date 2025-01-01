import { BigDecimalErrors } from "@/old-src/errors";
import { BigDecimal } from "@/core";

type Scale = typeof BigDecimal.prototype.scale;

/**
 * Validates scale parameter
 */
export function validateScale(scale: number): asserts scale is Scale {
  if (scale < 0) {
    throw BigDecimalErrors.invalidScale(scale, {
      context: "scale validation",
      expected: "non-negative number",
    });
  }
}

/**
 * Validates scale for raw values
 */
export function validateRawScale(scale: Scale): void {
  validateScale(scale);
}

/**
 * Checks if scale is valid
 */
export function isValidScale(scale: unknown): scale is Scale {
  return typeof scale === "number" && scale >= 0;
}
