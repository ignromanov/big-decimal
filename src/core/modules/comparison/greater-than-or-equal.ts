import { compareTo } from "./compare-to";

/**
 * Checks if this decimal is greater than or equal to another
 * @param this - The decimal to compare from
 * @param input - The decimal to compare with
 * @returns True if greater than or equal
 */
export function greaterThanOrEqual(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): boolean {
  const result = compareTo.call(this, input);
  return (
    typeof result === "number" &&
    !isNaN(result) &&
    (result === 1 || result === 0)
  );
}
