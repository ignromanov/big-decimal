// import { BigDecimalTypes } from "@/core/base";
// import { BigDecimalFactory } from "@/core/base/abstract-decimal.mixin-factory";
// import { EnhancedBigDecimal } from "@/core/implementations/enhanced-decimal.class";
// import { Constructor } from "@/types/constructor";
// import { arithmeticMethods } from "./arithmetic.methods";
// // export function WithArithmetic<TBase extends Constructor<BigDecimal>>(
// export function WithArithmetic<TBase extends Constructor<EnhancedBigDecimal>>(
//   Base: TBase
// ): Constructor<EnhancedBigDecimal> {
//   class ArithmeticBigDecimal extends Base {
//     /**
//      * Adds another value to this BigDecimal.
//      */
//     plus(other: BigDecimalTypes.Value) {
//       return arithmeticMethods.plus.call(this, other);
//     }

//     /**
//      * Subtracts another value from this BigDecimal.
//      */
//     minus(other: BigDecimalTypes.Value) {
//       return arithmeticMethods.minus.call(this, other);
//     }

//     /**
//      * Multiplies this BigDecimal by another value.
//      */
//     times(other: BigDecimalTypes.Value) {
//       return arithmeticMethods.times.call(this, other);
//     }

//     /**
//      * Divides this BigDecimal by another value.
//      */
//     div(other: BigDecimalTypes.Value, scale?: number) {
//       return arithmeticMethods.div.call(this, other, scale);
//     }

//     /**
//      * Raises this BigDecimal to the power of n.
//      */
//     pow(n: number) {
//       return arithmeticMethods.pow.call(this, n);
//     }

//     /**
//      * Calculates the square root of this BigDecimal.
//      */
//     sqrt(scale?: number) {
//       return arithmeticMethods.sqrt.call(this, scale);
//     }
//   }

//   return ArithmeticBigDecimal;
// }

// // Register module in factory
// BigDecimalFactory.registerModuleImplementation("arithmetic", WithArithmetic);
