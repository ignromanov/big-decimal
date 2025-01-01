// import {
//   BigDecimal,
//   RegularBigDecimal,
//   NaNBigDecimal,
//   InfiniteBigDecimal,
//   type BigDecimalTypes,
// } from "@/core";

// // Regular BigDecimal implementation
// RegularBigDecimal.prototype.plus = function (
//   this: RegularBigDecimal,
//   other: BigDecimalTypes.Value
// ): BigDecimal {
//   const otherDecimal = BigDecimal.create(other);

//   // NaN handling
//   if (otherDecimal instanceof NaNBigDecimal) {
//     return otherDecimal;
//   }

//   // Infinity handling
//   if (otherDecimal instanceof InfiniteBigDecimal) {
//     if (otherDecimal.sign !== this.sign) {
//       return RegularBigDecimal.NaN;
//     }
//     return otherDecimal;
//   }

//   const maxScale = Math.max(this.scale, otherDecimal.scale);
//   const thisScaled = this.scaleUp(maxScale).value;
//   const otherScaled = otherDecimal.scaleUp(maxScale).value;

//   const thisValue = this.sign === 1 ? thisScaled : -thisScaled;
//   const otherValue = otherDecimal.sign === 1 ? otherScaled : -otherScaled;
//   const sum = thisValue + otherValue;

//   return BigDecimal.fromRawValues(
//     sum < 0n ? -sum : sum,
//     maxScale,
//     sum < 0n ? -1 : 1
//   );
// };

// // NaN implementation
// NaNBigDecimal.prototype.plus = function (
//   this: NaNBigDecimal,
//   _other: BigDecimalTypes.Value
// ): BigDecimal {
//   return this;
// };

// // Infinite implementation
// InfiniteBigDecimal.prototype.plus = function (
//   this: InfiniteBigDecimal,
//   other: BigDecimalTypes.Value
// ): BigDecimal {
//   const otherDecimal = BigDecimal.create(other);
//   if (otherDecimal.isNaN()) return otherDecimal;
//   if (otherDecimal.isInfinite() && otherDecimal.sign !== this.sign) {
//     return RegularBigDecimal.NaN;
//   }
//   return this;
// };
