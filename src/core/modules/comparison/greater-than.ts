import { compareTo } from "./compare-to";

/**
 * Checks if this decimal is greater than another
 * @param this - The decimal to compare from
 * @param input - The decimal to compare with
 * @returns True if greater than
 */
export function greaterThan(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): boolean {
  const result = compareTo.call(this, input);
  return typeof result === "number" && !isNaN(result) && result === 1;
}
