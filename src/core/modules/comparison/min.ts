import { BigDecimalFactory } from "@/core/factory";
import { BigDecimalFlyweight } from "@/core/performance";
import { compareTo } from "./compare-to";

/**
 * Returns the minimum of this decimal and another
 * @param this - The decimal to compare from
 * @param input - The decimal to compare with
 * @returns The minimum value
 */
export function min(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): BigDecimalTypes.IBigDecimal {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (other.isNaN()) return BigDecimalFlyweight.NaN;
  if (this.isZero() && other.isZero())
    return this.sign <= other.sign ? this : other;
  if (other.isInfinite() && other.sign === -1) return other;
  if (other.isInfinite() && other.sign === 1) return this;
  if (!other.isRegular()) return BigDecimalFlyweight.NaN;

  const result = compareTo.call(this, input);
  return typeof result === "number" && !isNaN(result) && result <= 0
    ? this
    : other;
}
