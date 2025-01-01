import { AbstractBigDecimal } from "@/core/base";
import type { InfiniteBigDecimal } from "./infinite-decimal.class";
import type { RegularBigDecimal } from "./regular-decimal.class";

/**
 * Special BigDecimal implementation representing Not-a-Number (NaN).
 * Implements the Singleton pattern to ensure only one NaN instance exists.
 *
 * @remarks
 * This class represents the BigDecimal equivalent of JavaScript's NaN.
 * It is immutable and all instances are frozen using Object.freeze().
 *
 * @example
 * ```typescript
 * const nan = NaNBigDecimal.instance;
 * console.log(nan.toString()); // "NaN"
 * console.log(nan.valueOf()); // NaN
 * ```
 */
export class NaNBigDecimal extends AbstractBigDecimal {
  /** Singleton instance of NaNBigDecimal */
  private static _instance: NaNBigDecimal;

  /** Always null for NaN */
  protected _value: null = null;

  /** Always null for NaN */
  protected _sign: null = null;

  /** Always 0 for NaN */
  protected _exp: number = 0;

  /**
   * Private constructor to prevent direct instantiation.
   * Use {@link NaNBigDecimal.instance} to get the singleton instance.
   */
  private constructor() {
    super();
  }

  /**
   * Gets the sign of NaN (always null).
   * @returns null - Indicating NaN has no sign
   */
  get sign(): null {
    return this._sign;
  }

  /**
   * Gets the value of NaN (always null).
   * @returns null - Indicating NaN has no numerical value
   */
  get value(): null {
    return this._value;
  }

  /**
   * Gets the exponent of NaN (always 0).
   * @returns 0 - Conventional exponent for NaN
   */
  get exp(): number {
    return this._exp;
  }

  /**
   * Gets the singleton instance of NaNBigDecimal.
   * Creates the instance on first access.
   *
   * @returns The singleton NaNBigDecimal instance
   */
  static get instance(): NaNBigDecimal {
    if (!NaNBigDecimal._instance) {
      NaNBigDecimal._instance = new NaNBigDecimal();
    }
    return NaNBigDecimal._instance;
  }

  /**
   * Type guard to check if this is a NaNBigDecimal.
   * @returns true - Always returns true as this is NaN
   */
  isNaN(): this is NaNBigDecimal {
    return true;
  }

  /**
   * Type guard to check if this is an InfiniteBigDecimal.
   * @returns false - NaN is not infinite
   */
  isInfinite(): this is InfiniteBigDecimal {
    return false;
  }

  /**
   * Type guard to check if this is a RegularBigDecimal.
   * @returns false - NaN is not a regular number
   */
  isFinite(): this is RegularBigDecimal {
    return false;
  }

  /**
   * Converts NaN to its JavaScript number equivalent.
   * @returns NaN - JavaScript's NaN value
   */
  valueOf(): number {
    return NaN;
  }

  /**
   * Converts NaN to its string representation.
   * @returns "NaN" - String representation of NaN
   */
  toString(): string {
    return "NaN";
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
