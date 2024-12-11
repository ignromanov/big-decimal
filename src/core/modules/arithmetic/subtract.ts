import { BigDecimalFactory } from "@/core/factory";
import { RegularDecimal } from "@/core/implementations";
import { BigDecimalFlyweight } from "@/core/performance";

/**
 * Subtracts another decimal number
 * @param this - The decimal to subtract from
 * @param input - The decimal to subtract
 * @returns The difference as a new decimal
 */
export function subtract(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.IBigDecimal
): BigDecimalTypes.IBigDecimal {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (this.isZero()) {
    // For +0 - (+0) return +0
    // For +0 - (-0) return +0
    // For -0 - (+0) return -0
    // For -0 - (-0) return +0
    if (other.isZero()) {
      return this.sign === -1 && other.sign === 1
        ? BigDecimalFlyweight.NEGATIVE_ZERO
        : BigDecimalFlyweight.ZERO;
    }
    return other.negate();
  }
  if (other.isZero()) return this;
  if (other.isNaN()) return other.subtract(this);
  if (other.isInfinite()) return other.subtract(this);

  // If signs differ, convert to addition
  if (this.sign !== other.sign) {
    const positiveOther = RegularDecimal.fromRaw(
      other.value,
      other.exp,
      -other.sign as BigDecimalTypes.Sign
    );
    return this.add(positiveOther);
  }

  // Normalize exponents
  const exp = Math.min(this.exp, other.exp);
  const thisShift = this.exp - exp;
  const otherShift = other.exp - exp;

  const thisValue = this.value * 10n ** BigInt(thisShift);
  const otherValue = other.value * 10n ** BigInt(otherShift);

  // Determine which number is larger in absolute terms
  const isThisLarger = thisValue >= otherValue;

  // Calculate difference
  const larger = isThisLarger ? thisValue : otherValue;
  const smaller = isThisLarger ? otherValue : thisValue;
  const diff = larger - smaller;

  if (diff === 0n) {
    // For a - a, always return +0
    return BigDecimalFlyweight.ZERO;
  }

  // Determine sign based on which number was larger
  const resultSign = ((isThisLarger ? 1 : -1) * this.sign) as 1 | -1;

  return RegularDecimal.fromRaw(diff, exp, resultSign);
}
