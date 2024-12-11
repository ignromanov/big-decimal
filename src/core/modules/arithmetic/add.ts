import { RegularDecimal } from "@/core/implementations";
import { BigDecimalFlyweight } from "@/core/performance";

import { BigDecimalFactory } from "@/core/factory";

/**
 * Adds two decimal numbers
 * @param this - The decimal to add to
 * @param input - The decimal to add
 * @returns The sum as a new decimal
 */
export function add(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): BigDecimalTypes.IBigDecimal {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (this.isZero()) {
    // For +0 + (+0 or -0) return +0
    // For -0 + (+0) return +0
    // For -0 + (-0) return -0
    if (other.isZero()) {
      return this.sign === -1 && other.sign === -1
        ? BigDecimalFlyweight.NEGATIVE_ZERO
        : BigDecimalFlyweight.ZERO;
    }
    return other;
  }

  if (other.isZero()) return this;
  if (other.isNaN()) return other.add(this);
  if (other.isInfinite()) return other.add(this);

  // If signs differ, convert to subtraction
  if (this.sign !== other.sign) {
    return this.subtract(other.negate());
  }

  // Normalize exponents
  const exp = Math.min(this.exp, other.exp);
  const thisShift = this.exp - exp;
  const otherShift = other.exp - exp;

  const thisValue = this.value * 10n ** BigInt(thisShift);
  const otherValue = other.value * 10n ** BigInt(otherShift);

  // Calculate sum
  const sum = thisValue + otherValue;
  if (sum === 0n) {
    // For opposing numbers (a + (-a)):
    // If first number was positive, return +0
    // If first number was negative, return -0
    return this.sign === 1
      ? BigDecimalFlyweight.ZERO
      : BigDecimalFlyweight.NEGATIVE_ZERO;
  }

  return RegularDecimal.fromRaw(sum, exp, this.sign);
}
