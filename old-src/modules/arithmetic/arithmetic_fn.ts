// import { RegularBigDecimal, type BigDecimalTypes } from "@/core";

// /**
//  * Adds another value to this BigDecimal.
//  * @param other - The value to add (can be string, number, bigint, or BigDecimal)
//  * @returns A new BigDecimal representing the sum
//  */
// RegularBigDecimal.prototype.plus = function (
//   this: RegularBigDecimal,
//   other: BigDecimalTypes.Value
// ): RegularBigDecimal {
//   const otherDecimal = new RegularBigDecimal(other);

//   // NaN handling
//   if (RegularBigDecimal.isNaN(this) || RegularBigDecimal.isNaN(otherDecimal)) {
//     return RegularBigDecimal.NaN;
//   }

//   // Infinity handling
//   if (
//     RegularBigDecimal.isInfinite(this) ||
//     RegularBigDecimal.isInfinite(otherDecimal)
//   ) {
//     if (
//       RegularBigDecimal.isInfinite(this) &&
//       RegularBigDecimal.isInfinite(otherDecimal)
//     ) {
//       if (this.sign === otherDecimal.sign) {
//         return this.sign === 1
//           ? RegularBigDecimal.POSITIVE_INFINITY
//           : RegularBigDecimal.NEGATIVE_INFINITY;
//       }
//       return RegularBigDecimal.NaN; // Infinity - Infinity = NaN
//     }
//     return RegularBigDecimal.isInfinite(this) ? this : otherDecimal;
//   }

//   const maxScale = Math.max(this.scale, otherDecimal.scale);
//   const thisScaled = this.scaleUp(maxScale).value;
//   const otherScaled = otherDecimal.scaleUp(maxScale).value;

//   const thisValue = this.sign === 1 ? thisScaled : -thisScaled;
//   const otherValue = otherDecimal.sign === 1 ? otherScaled : -otherScaled;
//   const sum = thisValue + otherValue;

//   return RegularBigDecimal.fromRawValues(
//     sum < 0n ? -sum : sum,
//     maxScale,
//     sum < 0n ? -1 : 1
//   );
// };

// /**
//  * Subtracts another value from this BigDecimal.
//  * @param other - The value to subtract (can be string, number, bigint, or BigDecimal)
//  * @returns A new BigDecimal representing the difference
//  */
// RegularBigDecimal.prototype.minus = function (
//   this: RegularBigDecimal,
//   other: BigDecimalTypes.Value
// ): RegularBigDecimal {
//   const otherDecimal = new RegularBigDecimal(other);
//   const negated = RegularBigDecimal.fromRawValues(
//     otherDecimal.value,
//     otherDecimal.scale,
//     -otherDecimal.sign
//   );
//   return this.plus(negated);
// };

// /**
//  * Multiplies this BigDecimal by another value.
//  * @param other - The value to multiply by (can be string, number, bigint, or BigDecimal)
//  * @returns A new BigDecimal representing the product
//  */
// RegularBigDecimal.prototype.times = function (
//   this: RegularBigDecimal,
//   other: BigDecimalTypes.Value
// ): RegularBigDecimal {
//   const otherDecimal = new RegularBigDecimal(other);

//   // NaN handling
//   if (RegularBigDecimal.isNaN(this) || RegularBigDecimal.isNaN(otherDecimal)) {
//     return RegularBigDecimal.NaN;
//   }

//   // Infinity handling
//   if (
//     RegularBigDecimal.isInfinite(this) ||
//     RegularBigDecimal.isInfinite(otherDecimal)
//   ) {
//     if (this.isZero() || otherDecimal.isZero()) {
//       return RegularBigDecimal.NaN; // Infinity * 0 = NaN
//     }
//     return RegularBigDecimal.fromRawValues(
//       null,
//       0,
//       this.sign! * otherDecimal.sign!
//     );
//   }

//   const newScale = this.scale + otherDecimal.scale;
//   const newValue = this.value * otherDecimal.value;

//   return RegularBigDecimal.fromRawValues(
//     newValue,
//     newScale,
//     this.sign * otherDecimal.sign
//   );
// };

// /**
//  * Divides this BigDecimal by another value.
//  * @param other - The value to divide by (can be string, number, bigint, or BigDecimal)
//  * @param scale - The scale of the result (defaults to this number's scale)
//  * @returns A new BigDecimal representing the quotient
//  * @throws {Error} If dividing by zero
//  */
// RegularBigDecimal.prototype.div = function (
//   this: RegularBigDecimal,
//   other: BigDecimalTypes.Value,
//   scale: number = this.scale
// ): RegularBigDecimal {
//   const otherDecimal = new RegularBigDecimal(other);
//   if (otherDecimal.isZero()) {
//     throw new Error("Division by zero");
//   }

//   const scaledThis = this.scaleUp(scale + otherDecimal.scale + 1);
//   const scaledOther = otherDecimal.scaleUp(0);
//   const quotient = scaledThis.value / scaledOther.value;

//   return RegularBigDecimal.fromRawValues(
//     quotient,
//     scale,
//     this.sign * otherDecimal.sign
//   );
// };

// /**
//  * Raises this BigDecimal to the power of n.
//  * @param n - The exponent (must be an integer)
//  * @returns A new BigDecimal representing this value raised to the power of n
//  * @throws {Error} If the exponent is not an integer
//  */
// RegularBigDecimal.prototype.pow = function (
//   this: RegularBigDecimal,
//   n: number
// ): RegularBigDecimal {
//   if (!Number.isInteger(n)) {
//     throw new Error("Exponent must be an integer");
//   }
//   let result = new RegularBigDecimal(1);
//   let base = this;
//   let exp = Math.abs(n);
//   while (exp > 0) {
//     if (exp % 2 === 1) {
//       result = result.times(base);
//     }
//     base = base.times(base);
//     exp = Math.floor(exp / 2);
//   }
//   return n < 0 ? new RegularBigDecimal(1).div(result) : result;
// };

// /**
//  * Calculates the square root of this BigDecimal.
//  * @param scale - The scale of the result (defaults to this number's scale)
//  * @returns A new BigDecimal representing the square root
//  * @throws {Error} If the number is negative
//  */
// RegularBigDecimal.prototype.sqrt = function (
//   this: RegularBigDecimal,
//   scale: number = this.scale
// ): RegularBigDecimal {
//   if (this.isNegative()) {
//     throw new Error("Square root of negative numbers is not supported");
//   }
//   if (this.isZero()) return new RegularBigDecimal(0);

//   let x = this.scaleUp(scale + 1);
//   let y = new RegularBigDecimal(x.value, 0).div(
//     new RegularBigDecimal(2),
//     scale + 1
//   );

//   return y;
// };
