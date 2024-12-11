import { RegularDecimal } from "@/core/implementations";

/**
 * Returns the negation of this decimal
 * @param this - The decimal to negate
 * @returns The negated value as a new decimal
 */
export function negate(
  this: BigDecimalTypes.IRegularDecimal
): BigDecimalTypes.IBigDecimal {
  if (this.isZero()) return this;
  return RegularDecimal.fromRaw(
    this.value,
    this.exp,
    -this.sign as BigDecimalTypes.Sign
  );
}
