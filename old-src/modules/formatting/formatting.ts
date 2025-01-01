import { BigDecimal, RegularBigDecimal } from "@/core";

/**
 * Returns a string representation with a fixed number of decimal places.
 * @param dp - The number of decimal places
 * @returns A string with the specified number of decimal places
 * @throws {Error} If dp is negative
 */
RegularBigDecimal.prototype.toFixed = function (
  this: RegularBigDecimal,
  dp: number
): string {
  if (dp < 0) throw new Error("Decimal places must be non-negative");
  if (this.isNaN()) return "NaN";
  if (this.isInfinite()) {
    return this.sign === 1 ? "Infinity" : "-Infinity";
  }

  const rounded = this.round(dp);
  return rounded.toString();
};

/**
 * Rounds a BigDecimal to a specified number of decimal places.
 * @param dp - The number of decimal places to round to
 * @returns A new BigDecimal rounded to the specified number of decimal places
 * @throws {Error} If dp is negative
 */
RegularBigDecimal.prototype.round = function (
  this: RegularBigDecimal,
  dp: number
): BigDecimal {
  if (dp < 0) throw new Error("Decimal places must be non-negative");
  if (this.isNaN()) return BigDecimal.NaN;
  if (this.isInfinite()) return this;

  if (dp >= this.scale) return this;

  const scaleDiff = this.scale - dp;
  const divisor = BigInt("1" + "0".repeat(scaleDiff));
  const remainder = this.value % divisor;
  const halfDivisor = divisor / 2n;

  let newValue = this.value / divisor;
  if (remainder >= halfDivisor) {
    newValue += 1n;
  }

  return BigDecimal.fromRawValues(newValue, dp, this.sign);
};
