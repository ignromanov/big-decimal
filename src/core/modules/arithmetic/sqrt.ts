import { RegularDecimal } from "@/core/implementations";
import { BigDecimalFlyweight } from "@/core/performance";

import { BigDecimalFactory } from "@/core/factory";

/**
 * Calculates the square root of this decimal
 * @param this - The decimal to calculate square root of
 * @returns The square root as a new decimal
 */
export function sqrt(
  this: BigDecimalTypes.IRegularDecimal
): BigDecimalTypes.IBigDecimal {
  // Handle special cases
  if (this.isZero()) return this;
  if (this.isNegative()) return BigDecimalFlyweight.NaN;

  // Initial estimate using native Math.sqrt
  // Convert to number for initial approximation
  const strValue = this.value.toString();
  const exp = this.exp;
  const adjustedExp = exp + (strValue.length % 2 ? 0 : 1);
  const estimate = Math.sqrt(Number(strValue));

  if (estimate === 0 || !Number.isFinite(estimate)) {
    return BigDecimalFlyweight.NaN;
  }

  // Create initial guess
  const half = BigDecimalFactory.create("0.5");
  let r = BigDecimalFactory.create(estimate.toString());
  r = RegularDecimal.fromRaw(
    r.value!,
    r.exp + Math.floor(adjustedExp / 2),
    r.sign!
  );

  // Newton-Raphson iteration
  // x[n+1] = (x[n] + a/x[n]) / 2
  for (let i = 0; i < 5; i++) {
    const prev = r;
    r = half.multiply(r.plus(this.divide(r)));
    if (r.equals(prev)) break;
  }

  return r;
}
