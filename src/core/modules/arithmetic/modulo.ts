import { BigDecimalFlyweight } from "@/core/performance";

import { BigDecimalFactory } from "@/core/factory";

/**
 * Calculates the modulo of this decimal by another decimal
 * @param this - The decimal dividend
 * @param input - The decimal divisor
 * @returns The remainder as a new decimal
 */
export function modulo(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.IBigDecimal
): BigDecimalTypes.IBigDecimal {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (!other.isRegular() || other.isZero()) {
    throw new Error("Division by zero");
  }

  // If this is not regular or is zero, return appropriate value
  if (!this.isRegular()) return BigDecimalFlyweight.NaN;
  if (this.isZero()) return this;

  // Save signs for later
  const thisSign = this.sign;
  // const otherSign = other.sign;

  // Set both numbers to positive for comparison
  const x = this.abs();
  const y = other.abs();

  // If y > x, result is x
  if (y.greaterThan(x)) return this;

  // Calculate x - y * floor(x/y)
  const quotient = x.divide(y);
  const product = y.multiply(quotient);
  const result = x.subtract(product);

  // Apply original sign of dividend
  return thisSign === 1 ? result : result.negate();
}
