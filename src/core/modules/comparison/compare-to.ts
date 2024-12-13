import { BigDecimalFactory } from "@/core/factory";

/**
 * Compares this decimal with another
 * @param this - The decimal to compare from
 * @param input - The decimal to compare with
 * @returns -1 if less, 0 if equal, 1 if greater
 */
export function compareTo(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): number {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (other.isNaN()) return NaN;
  if (this.isZero() && other.isZero()) return 0;
  if (other.isInfinite()) {
    return other.sign === 1 ? -1 : 1;
  }
  if (!other.isRegular()) return NaN;

  // If signs differ, comparison is based on signs
  if (this.sign !== other.sign) {
    return this.sign > other.sign ? 1 : -1;
  }

  // Normalize to same exponent
  const exp = Math.min(this.exp, other.exp);
  const thisShift = this.exp - exp;
  const otherShift = other.exp - exp;

  // Scale values to same exponent
  const thisValue = this.value * BigInt(10 ** thisShift);
  const otherValue = other.value * BigInt(10 ** otherShift);

  // Compare normalized values considering sign
  const comparison =
    thisValue === otherValue ? 0 : thisValue > otherValue ? 1 : -1;
  return this.sign === 1 ? comparison : -comparison;
}
