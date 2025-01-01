import { AbstractBigDecimal } from "@/core/base";
import type { NaNBigDecimal } from "./nan-decimal.class";
import type { RegularBigDecimal } from "./regular-decimal.class";
import { validateSign } from "@/old-src/utils/validation";

/**
 * Special BigDecimal implementation representing Infinity.
 * Provides two immutable singleton instances for positive and negative infinity.
 *
 * @remarks
 * This class represents the BigDecimal equivalent of JavaScript's Infinity.
 * It is immutable and all instances are frozen using Object.freeze().
 *
 * @example
 * ```typescript
 * const posInf = InfiniteBigDecimal.POSITIVE;
 * const negInf = InfiniteBigDecimal.NEGATIVE;
 * console.log(posInf.toString()); // "Infinity"
 * console.log(negInf.valueOf()); // -Infinity
 * ```
 */
export class InfiniteBigDecimal extends AbstractBigDecimal {
  /** Always null for Infinity */
  protected _value: null = null;

  /** Sign of infinity (1 for positive, -1 for negative) */
  protected _sign: 1 | -1;

  /** Always 0 for Infinity */
  protected _exp: number = 0;

  /** Singleton instance for positive infinity */
  static readonly POSITIVE = new InfiniteBigDecimal(1);

  /** Singleton instance for negative infinity */
  static readonly NEGATIVE = new InfiniteBigDecimal(-1);

  /**
   * Private constructor to prevent direct instantiation.
   * Use {@link InfiniteBigDecimal.POSITIVE} or {@link InfiniteBigDecimal.NEGATIVE} to get instances.
   *
   * @param sign - Sign of infinity (1 for positive, -1 for negative)
   * @internal
   */
  private constructor(sign: 1 | -1) {
    super();
    validateSign(sign);
    this._sign = sign;
    // Object.freeze(this);
  }

  /**
   * Gets the sign of infinity.
   * @returns 1 for positive infinity, -1 for negative infinity
   */
  get sign(): 1 | -1 {
    return this._sign;
  }

  /**
   * Gets the value (always null for infinity).
   * @returns null - Indicating infinity has no finite value
   */
  get value(): null {
    return this._value;
  }

  /**
   * Gets the exponent (always 0 for infinity).
   * @returns 0 - Conventional exponent for infinity
   */
  get exp(): number {
    return this._exp;
  }

  /**
   * Type guard to check if this is a NaNBigDecimal.
   * @returns false - Infinity is not NaN
   */
  isNaN(): this is NaNBigDecimal {
    return false;
  }

  /**
   * Type guard to check if this is an InfiniteBigDecimal.
   * @returns true - Always returns true as this is Infinity
   */
  isInfinite(): this is InfiniteBigDecimal {
    return true;
  }

  /**
   * Type guard to check if this is a RegularBigDecimal.
   * @returns false - Infinity is not a regular number
   */
  isFinite(): this is RegularBigDecimal {
    return false;
  }

  /**
   * Converts infinity to its JavaScript number equivalent.
   * @returns Infinity or -Infinity based on sign
   */
  valueOf(): number {
    return this._sign > 0 ? Infinity : -Infinity;
  }

  /**
   * Converts infinity to its string representation.
   * @returns "Infinity" or "-Infinity" based on sign
   */
  toString(): string {
    return this._sign > 0 ? "Infinity" : "-Infinity";
  }

  /**
   * Converts value to primitive type
   * @param hint - Type hint ("string" or "number")
   * @returns String or number representation
   * @internal
   */
  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === "string") return this.toString();
    return this.valueOf();
  }
}
