import { RegularDecimal } from "@/core/implementations";
import { BigDecimalFlyweight } from "@/core/performance";

import { BigDecimalFactory } from "@/core/factory";

/**
 * Divides by another decimal number
 * @param this - The decimal to divide
 * @param input - The decimal to divide by
 * @returns The quotient as a new decimal
 */
export function divide(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.IBigDecimal
): BigDecimalTypes.IBigDecimal {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (other.isZero()) {
    throw new Error("Division by zero");
  }
  if (this.isZero()) return BigDecimalFlyweight.ZERO;
  if (other.isNaN() || this.isNaN()) return BigDecimalFlyweight.NaN;
  if (other.isInfinite()) return BigDecimalFlyweight.ZERO;

  // Determine sign of result
  const resultSign = (this.sign * other.sign) as 1 | -1;

  // Calculate initial scale for precision
  const precision = 20; // Can be configurable
  const scale = 10n ** BigInt(precision);

  // Scale the dividend to maintain precision
  const scaledValue = this.value * scale;

  // Normalize exponents
  const expDiff = this.exp - other.exp;
  const normalizedValue =
    expDiff >= 0
      ? scaledValue * 10n ** BigInt(expDiff)
      : scaledValue / 10n ** BigInt(-expDiff);

  // Perform division
  const quotient = normalizedValue / other.value;

  if (quotient === 0n) {
    // For division, sign of zero is product of signs
    return this.sign * other.sign === 1
      ? BigDecimalFlyweight.ZERO
      : BigDecimalFlyweight.NEGATIVE_ZERO;
  }

  // Calculate final exponent
  const resultExp = -precision;

  // Remove trailing zeros and adjust exponent
  let finalValue = quotient;
  let finalExp = resultExp;
  while (finalValue !== 0n && finalValue % 10n === 0n) {
    finalValue /= 10n;
    finalExp += 1;
  }

  return RegularDecimal.fromRaw(finalValue, finalExp, resultSign);
}
