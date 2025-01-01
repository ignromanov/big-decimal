import { BigDecimalErrors } from "@/old-src/errors";
import { BigDecimal } from "@/core";

type Sign = NonNullable<typeof BigDecimal.prototype.sign>;
type NullableSign = typeof BigDecimal.prototype.sign;

/**
 * Validates sign for regular BigDecimal
 */
export function validateSign(sign: unknown): asserts sign is Sign {
  if (sign !== -1 && sign !== 1) {
    throw BigDecimalErrors.invalidSign(sign, {
      context: "sign validation",
      expected: "[-1, 1]",
    });
  }
}

/**
 * Validates sign including null for special values
 */
export function validateNullableSign(
  sign: unknown
): asserts sign is NullableSign {
  if (sign !== -1 && sign !== 1 && sign !== null) {
    throw BigDecimalErrors.invalidSign(sign, {
      context: "sign validation",
      expected: "[-1, 1, null]",
    });
  }
}

/**
 * Validates sign for raw values
 */
export function validateRawSign(sign: NullableSign): void {
  validateNullableSign(sign);
}
