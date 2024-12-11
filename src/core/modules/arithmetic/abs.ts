/**
 * Returns the absolute value of this decimal
 * @param this - The decimal to get absolute value of
 * @returns The absolute value as a new decimal
 */
export function abs(
  this: BigDecimalTypes.IRegularDecimal
): BigDecimalTypes.IBigDecimal {
  if (this.sign === 1 || this.isZero()) return this;
  return this.negate();
}
