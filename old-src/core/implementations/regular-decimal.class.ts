import { AbstractBigDecimal } from "@/core/base";
import type { InfiniteBigDecimal } from "./infinite-decimal.class";
import type { NaNBigDecimal } from "./nan-decimal.class";

/**
 * A class for arbitrary-precision decimal arithmetic.
 * Represents regular (finite) decimal numbers with arbitrary precision.
 *
 * @remarks
 * This class handles all finite decimal numbers using a combination of:
 * - bigint for the numerical value (without sign)
 * - number for the exponent
 * - sign indicator (1 or -1)
 *
 * @example
 * ```typescript
 * const num = RegularBigDecimal.fromRawValues(123456n, -3, 1); // 123.456
 * console.log(num.toString()); // "123.456"
 * ```
 */
export class RegularBigDecimal extends AbstractBigDecimal {
  /** The numerical value stored as a bigint (without sign) */
  protected _value: bigint = 0n;

  /** Sign of the number (1 for positive, -1 for negative) */
  protected _sign: 1 | -1 = 1;

  /** Exponent of the number */
  protected _exp: number = 0;

  /**
   * Private constructor to prevent direct instantiation.
   * Use {@link RegularBigDecimal.fromRawValues} to create instances.
   * @internal
   */
  private constructor() {
    super();
  }

  /**
   * Gets the sign of the number.
   * @returns 1 for positive numbers, -1 for negative numbers
   */
  get sign(): 1 | -1 {
    return this._sign;
  }

  /**
   * Gets the numerical value (without sign).
   * @returns The bigint value representing the significant digits
   */
  get value(): bigint {
    return this._value;
  }

  /**
   * Gets the exponent of the number.
   * @returns The exponent indicating decimal point position
   */
  get exp(): number {
    return this._exp;
  }

  /**
   * Creates a RegularBigDecimal from raw components.
   *
   * @param value - The numerical value as bigint (without sign)
   * @param exp - The exponent for decimal point position
   * @param sign - The sign (1 for positive, -1 for negative)
   * @returns A new RegularBigDecimal instance
   * @internal
   */
  static fromRawValues(
    value: bigint,
    exp: number,
    sign: 1 | -1
  ): RegularBigDecimal {
    const instance = new RegularBigDecimal();
    instance._value = value;
    instance._exp = exp;
    instance._sign = sign;
    return instance;
  }

  /**
   * Type guard to check if this is a NaNBigDecimal.
   * @returns false - Regular numbers are not NaN
   */
  isNaN(): this is NaNBigDecimal {
    return false;
  }

  /**
   * Type guard to check if this is an InfiniteBigDecimal.
   * @returns false - Regular numbers are not infinite
   */
  isInfinite(): this is InfiniteBigDecimal {
    return false;
  }

  /**
   * Type guard to check if this is a RegularBigDecimal.
   * @returns true - Always returns true as this is a regular number
   */
  isFinite(): this is RegularBigDecimal {
    return true;
  }

  /**
   * Converts the decimal to its JavaScript number equivalent.
   * @returns The number representation (may lose precision for large values)
   */
  valueOf(): number {
    return Number(this._value) * this._sign * Math.pow(10, this._exp);
  }

  /**
   * Converts the decimal to its string representation.
   * @returns The exact string representation of the number
   */
  toString(): string {
    const sign = this._sign === -1 ? "-" : "";
    const value = this._value.toString();
    const exp = this._exp;

    if (exp === 0) return `${sign}${value}`;
    return `${sign}${value}e${exp}`;
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
