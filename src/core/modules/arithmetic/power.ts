import { BigDecimalFlyweight } from "@/core/performance";

import { BigDecimalFactory } from "@/core/factory";

/**
 * Raises the decimal to the power of another decimal
 * @param this - The decimal base
 * @param input - The decimal exponent
 * @returns The result as a new decimal
 */
export function power(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): BigDecimalTypes.IBigDecimal {
  const exponent = BigDecimalFactory.create(input);

  // Handle special cases
  if (!exponent.isRegular()) return BigDecimalFlyweight.NaN;
  if (exponent.isZero()) return BigDecimalFlyweight.ONE;
  if (this.isZero()) return this;

  // Get exponent as number
  const n = exponent.toNumber();
  if (!Number.isInteger(n)) return BigDecimalFlyweight.NaN;
  if (Math.abs(n) > 1e6) throw new Error("Exponent out of range");

  const isNegative = n < 0;
  const absN = Math.abs(n);
  let x = this;
  let y = BigDecimalFlyweight.ONE;

  // Square and multiply algorithm
  for (;;) {
    if (absN & 1) {
      const temp = y.multiply(x);
      if (!temp.isRegular()) return temp;
      y = temp;
    }
    const n2 = absN >> 1;
    if (n2 === 0) break;
    const temp = x.multiply(x);
    if (!temp.isRegular()) return temp;
    x = temp;
  }

  return isNegative ? BigDecimalFlyweight.ONE.divide(y) : y;
}
