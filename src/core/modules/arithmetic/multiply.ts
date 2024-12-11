import { RegularDecimal } from "@/core/implementations";
import { BigDecimalFlyweight } from "@/core/performance";

import { BigDecimalFactory } from "@/core/factory";

/**
 * Multiplies by another decimal number
 * @param this - The decimal to multiply
 * @param input - The decimal to multiply by
 * @returns The product as a new decimal
 */
export function multiply(
  this: BigDecimalTypes.IRegularDecimal,
  input: BigDecimalTypes.IBigDecimal
): BigDecimalTypes.IBigDecimal {
  const other = BigDecimalFactory.create(input);

  // Handle special cases
  if (other.isNaN()) return other.multiply(this);
  if (other.isInfinite()) return other.multiply(this);
  if (this.isZero() || other.isZero()) return BigDecimalFlyweight.ZERO;

  // Determine sign of result
  const resultSign = (this.sign * other.sign) as 1 | -1;

  // Convert values to strings to handle digit-by-digit multiplication
  const thisDigits = this.value.toString().split("").map(Number);
  const otherDigits = other.value.toString().split("").map(Number);

  // Initialize result array with zeros
  const resultLength = thisDigits.length + otherDigits.length;
  const result = new Array(resultLength).fill(0);

  // Perform multiplication digit by digit
  for (let i = otherDigits.length - 1; i >= 0; i--) {
    let carry = 0;
    for (let j = thisDigits.length - 1; j >= 0; j--) {
      const position = i + j + 1;
      const product = otherDigits[i] * thisDigits[j] + result[position] + carry;
      result[position] = product % 10;
      carry = Math.floor(product / 10);
    }
    result[i] = carry;
  }

  // Remove leading zeros
  while (result[0] === 0 && result.length > 1) {
    result.shift();
  }

  // Convert back to bigint
  const resultValue = BigInt(result.join(""));

  if (resultValue === 0n) {
    // For multiplication, sign of zero is product of signs
    return this.sign * other.sign === 1
      ? BigDecimalFlyweight.ZERO
      : BigDecimalFlyweight.NEGATIVE_ZERO;
  }

  // Calculate final exponent
  const resultExp = this.exp + other.exp;

  return RegularDecimal.fromRaw(resultValue, resultExp, resultSign);
}
