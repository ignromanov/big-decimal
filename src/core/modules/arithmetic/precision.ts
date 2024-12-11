import { RegularDecimal } from "@/core/implementations";

/**
 * Sets the precision of the decimal
 * @param this - The decimal to set precision of
 * @param precision - Number of significant digits to keep
 * @returns The decimal with adjusted precision as a new decimal
 */
export function precision(
  this: BigDecimalTypes.IRegularDecimal,
  precision: number
): BigDecimalTypes.IBigDecimal {
  // Handle special cases
  if (!Number.isInteger(precision) || precision < 1 || precision > 1e6) {
    throw new Error("Invalid precision");
  }

  // Get string representation of value
  const str = this.value.toString();
  const len = str.length;

  // If precision is greater than length, pad with zeros
  if (precision >= len) {
    return RegularDecimal.fromRaw(this.value, this.exp, this.sign);
  }

  // Calculate new value and exponent
  const newValue = BigInt(str.slice(0, precision));
  const newExp = this.exp + (len - precision);

  return RegularDecimal.fromRaw(newValue, newExp, this.sign);
}
