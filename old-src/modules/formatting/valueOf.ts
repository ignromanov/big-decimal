import {
  InfiniteBigDecimal,
  NaNBigDecimal,
  RegularBigDecimal,
} from "@/core/implementations";

// Regular BigDecimal implementation
RegularBigDecimal.prototype.valueOf = function (
  this: RegularBigDecimal
): number {
  if (this.scale === 0) {
    return Number(this.sign * Number(this.value));
  }
  return Number(this.sign * Number(this.value)) / Math.pow(10, this.scale);
};

// NaN implementation
NaNBigDecimal.prototype.valueOf = function (this: NaNBigDecimal): number {
  return NaN;
};

// Infinite implementation
InfiniteBigDecimal.prototype.valueOf = function (
  this: InfiniteBigDecimal
): number {
  return this.sign === 1 ? Infinity : -Infinity;
};
