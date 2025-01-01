import {
  InfiniteBigDecimal,
  NaNBigDecimal,
  RegularBigDecimal,
} from "@/core/implementations";

// Regular BigDecimal implementation
RegularBigDecimal.prototype.toString = function (
  this: RegularBigDecimal
): string {
  const config = RegularBigDecimal.getConfig();

  // Handle zero case
  if (this.value === 0n) {
    if (config.FORMAT.signedZero && this.sign === -1) {
      return "-0";
    }
    return "0";
  }

  // Get absolute value as string
  let str = this.value.toString();
  const sign = this.sign === -1 ? "-" : "";

  // Handle positive exponent (multiply)
  if (this.exp >= 0) {
    str = str + "0".repeat(this.exp);
    return sign + str;
  }

  // Handle negative exponent (divide)
  const absExp = Math.abs(this.exp);

  // If number is less than 1 (e.g., 0.0123)
  if (str.length <= absExp) {
    const zerosNeeded = absExp - str.length;
    return sign + "0." + "0".repeat(zerosNeeded) + str;
  }

  // For numbers greater than 1 (e.g., 123.45)
  const insertAt = str.length - absExp;
  const intPart = str.slice(0, insertAt) || "0";
  const fracPart = str.slice(insertAt);

  // Don't show fraction part if it's all zeros
  if (fracPart.match(/^0+$/)) {
    return sign + intPart;
  }

  return sign + intPart + "." + fracPart;
};

// NaN implementation
NaNBigDecimal.prototype.toString = function (this: NaNBigDecimal): string {
  return "NaN";
};

// Infinite implementation
InfiniteBigDecimal.prototype.toString = function (
  this: InfiniteBigDecimal
): string {
  return this.sign === 1 ? "Infinity" : "-Infinity";
};
