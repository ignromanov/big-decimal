import { RegularBigDecimal } from "@/core";

/**
 * Implements the toPrimitive symbol to allow BigDecimal to be used in comparisons.
 */
RegularBigDecimal.prototype[Symbol.toPrimitive] = function (
  this: RegularBigDecimal,
  hint: string
): number | string {
  if (hint === "number") {
    return this.valueOf();
  }
  return this.toString();
};

/**
 * Converts the BigDecimal to a primitive value for comparisons.
 * @returns A number representation of the BigDecimal.
 */
RegularBigDecimal.prototype.valueOf = function (
  this: RegularBigDecimal
): number {
  const value = Number(this.value) / 10 ** this.scale;
  return this.sign * value;
};
