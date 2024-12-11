import { RegularDecimal } from "@/core/implementations";

/**
 * Rounds the decimal to specified precision
 * @param this - The decimal to round
 * @param precision - Number of decimal places to round to
 * @returns The rounded decimal as a new decimal
 */
export function round(
  this: BigDecimalTypes.IRegularDecimal,
  precision: number
): BigDecimalTypes.IBigDecimal {
  // Handle special cases
  if (!Number.isInteger(precision)) {
    throw new Error("Invalid precision");
  }

  // Get string representation of value
  // const str = this.value.toString();
  // const len = str.length;
  const targetExp = -precision;

  // If current exponent matches target, no rounding needed
  if (this.exp === targetExp) {
    return this;
  }

  // Calculate shift needed
  const shift = this.exp - targetExp;
  let newValue = this.value;
  let newExp = this.exp;

  if (shift > 0) {
    // Need to add zeros
    newValue = newValue * 10n ** BigInt(shift);
    newExp -= shift;
  } else if (shift < 0) {
    // Need to remove digits and round
    const absShift = -shift;
    const divisor = 10n ** BigInt(absShift);
    const remainder = newValue % divisor;
    newValue = newValue / divisor;

    // Round up if remainder is >= half of divisor
    if (remainder * 2n >= divisor) {
      newValue += 1n;
    }

    newExp += absShift;
  }

  return RegularDecimal.fromRaw(newValue, newExp, this.sign);
}
