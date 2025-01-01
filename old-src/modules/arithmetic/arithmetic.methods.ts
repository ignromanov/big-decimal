import { BigDecimal } from "@/core";
import { BigDecimalTypes } from "@/core/base";

export const arithmeticMethods = {
  plus(this: BigDecimal, other: BigDecimalTypes.Value): BigDecimal {
    const otherDecimal = new BigDecimal(other);

    // NaN handling
    if (BigDecimal.isNaN(this) || BigDecimal.isNaN(otherDecimal)) {
      return BigDecimal.NaN;
    }

    // Infinity handling
    if (BigDecimal.isInfinite(this) || BigDecimal.isInfinite(otherDecimal)) {
      if (BigDecimal.isInfinite(this) && BigDecimal.isInfinite(otherDecimal)) {
        if (this.sign === otherDecimal.sign) {
          return this.sign === 1
            ? BigDecimal.POSITIVE_INFINITY
            : BigDecimal.NEGATIVE_INFINITY;
        }
        return BigDecimal.NaN; // Infinity - Infinity = NaN
      }
      return BigDecimal.isInfinite(this) ? this : otherDecimal;
    }

    const maxScale = Math.max(this.scale, otherDecimal.scale);
    const thisScaled = this.scaleUp(maxScale).value;
    const otherScaled = otherDecimal.scaleUp(maxScale).value;

    const thisValue = this.sign === 1 ? thisScaled : -thisScaled;
    const otherValue = otherDecimal.sign === 1 ? otherScaled : -otherScaled;
    const sum = thisValue + otherValue;

    return BigDecimal.fromRawValues(
      sum < 0n ? -sum : sum,
      maxScale,
      sum < 0n ? -1 : 1
    );
  },

  minus(this: BigDecimal, other: BigDecimalTypes.Value): BigDecimal {
    const otherDecimal = new BigDecimal(other);
    const negated = BigDecimal.fromRawValues(
      otherDecimal.value,
      otherDecimal.scale,
      -otherDecimal.sign
    );
    return this.plus(negated);
  },

  times(this: BigDecimal, other: BigDecimalTypes.Value): BigDecimal {
    const otherDecimal = new BigDecimal(other);

    // NaN handling
    if (BigDecimal.isNaN(this) || BigDecimal.isNaN(otherDecimal)) {
      return BigDecimal.NaN;
    }

    // Infinity handling
    if (BigDecimal.isInfinite(this) || BigDecimal.isInfinite(otherDecimal)) {
      if (this.isZero() || otherDecimal.isZero()) {
        return BigDecimal.NaN; // Infinity * 0 = NaN
      }
      return BigDecimal.fromRawValues(null, 0, this.sign! * otherDecimal.sign!);
    }

    const newScale = this.scale + otherDecimal.scale;
    const newValue = this.value * otherDecimal.value;

    return BigDecimal.fromRawValues(
      newValue,
      newScale,
      this.sign * otherDecimal.sign
    );
  },

  div(
    this: BigDecimal,
    other: BigDecimalTypes.Value,
    scale: number = this.scale
  ): BigDecimal {
    const otherDecimal = new BigDecimal(other);
    if (otherDecimal.isZero()) {
      throw new Error("Division by zero");
    }

    const scaledThis = this.scaleUp(scale + otherDecimal.scale + 1);
    const scaledOther = otherDecimal.scaleUp(0);
    const quotient = scaledThis.value / scaledOther.value;

    return BigDecimal.fromRawValues(
      quotient,
      scale,
      this.sign * otherDecimal.sign
    );
  },

  pow(this: BigDecimal, n: number): BigDecimal {
    if (!Number.isInteger(n)) {
      throw new Error("Exponent must be an integer");
    }
    let result = new BigDecimal(1);
    let base = this;
    let exp = Math.abs(n);
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = result.times(base);
      }
      base = base.times(base);
      exp = Math.floor(exp / 2);
    }
    return n < 0 ? new BigDecimal(1).div(result) : result;
  },

  sqrt(this: BigDecimal, scale: number = this.scale): BigDecimal {
    if (this.isNegative()) {
      throw new Error("Square root of negative numbers is not supported");
    }
    if (this.isZero()) return new BigDecimal(0);

    let x = this.scaleUp(scale + 1);
    let y = new BigDecimal(x.value, 0).div(new BigDecimal(2), scale + 1);

    return y;
  },
};
