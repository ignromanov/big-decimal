import { BigDecimal } from "@/core/base";
import { BigDecimalTypes } from "@/core/base";
import { arithmeticMethods } from "./arithmetic.methods";
import type { IArithmeticModule } from "./arithmetic.types";
// export function WithArithmetic<TBase extends Constructor<BigDecimal>>(

export class ArithmeticModule implements IArithmeticModule {
  constructor(private decimal: BigDecimal) {}

  /**
   * Adds another value to this BigDecimal.
   */
  plus(other: BigDecimalTypes.Value): BigDecimal {
    return arithmeticMethods.plus.call(this.decimal, other);
  }

  /**
   * Subtracts another value from this BigDecimal.
   */
  minus(other: BigDecimalTypes.Value): BigDecimal {
    return arithmeticMethods.minus.call(this.decimal, other);
  }

  /**
   * Multiplies this BigDecimal by another value.
   */
  times(other: BigDecimalTypes.Value): BigDecimal {
    return arithmeticMethods.times.call(this.decimal, other);
  }

  /**
   * Divides this BigDecimal by another value.
   */
  div(other: BigDecimalTypes.Value, scale?: number): BigDecimal {
    return arithmeticMethods.div.call(this.decimal, other, scale);
  }

  /**
   * Raises this BigDecimal to the power of n.
   */
  pow(n: number): BigDecimal {
    return arithmeticMethods.pow.call(this.decimal, n);
  }

  /**
   * Calculates the square root of this BigDecimal.
   */
  sqrt(scale?: number): BigDecimal {
    return arithmeticMethods.sqrt.call(this.decimal, scale);
  }
}
