import { compareTo } from "./compare-to";

/**
 * Checks if this decimal is less than or equal to another
 * @param this - The decimal to compare from
 * @param input - The decimal to compare with
 * @returns True if less than or equal
 */
export function lessThanOrEqual(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.Input
): boolean {
  const result = compareTo.call(this, input);
  return (
    typeof result === "number" &&
    !isNaN(result) &&
    (result === -1 || result === 0)
  );
}
