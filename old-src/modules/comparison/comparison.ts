// import { RegularBigDecimal } from "@/core";

// /**
//  * Compares this BigDecimal with another.
//  * @param other - The BigDecimal to compare with
//  * @returns -1 if this < other, 0 if this === other, 1 if this > other
//  */
// RegularBigDecimal.prototype.compareTo = function (
//   this: RegularBigDecimal,
//   other: RegularBigDecimal
// ): number {
//   if (this.sign !== other.sign) {
//     return this.sign;
//   }

//   const maxScale = Math.max(this.scale, other.scale);
//   const thisScaled = this.scaleUp(maxScale).value;
//   const otherScaled = other.scaleUp(maxScale).value;

//   if (thisScaled === otherScaled) return 0;
//   return thisScaled > otherScaled ? this.sign : -this.sign;
// };

// /**
//  * Checks if this BigDecimal is zero.
//  * @returns true if the value is zero, false otherwise
//  */
// RegularBigDecimal.prototype.isZero = function (
//   this: RegularBigDecimal
// ): boolean {
//   return this.value === 0n;
// };

// /**
//  * Checks if this BigDecimal is positive.
//  * @returns true if the value is positive, false otherwise
//  */
// RegularBigDecimal.prototype.isPositive = function (
//   this: RegularBigDecimal
// ): boolean {
//   return this.sign === 1;
// };

// /**
//  * Checks if this BigDecimal is negative.
//  * @returns true if the value is negative, false otherwise
//  */
// RegularBigDecimal.prototype.isNegative = function (
//   this: RegularBigDecimal
// ): boolean {
//   return this.sign === -1;
// };
