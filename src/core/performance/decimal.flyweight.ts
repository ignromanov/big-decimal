import { InfinityDecimal, NaNDecimal } from "@/core/implementations";
import { BigDecimalCache } from "./decimal.cache";
import { DECIMAL_CONSTANTS } from "./decimal.constants";

/**
 * Flyweight pattern implementation for BigDecimal values.
 * Provides a centralized storage for commonly used decimal values,
 * ensuring that only one instance of each value exists in memory.
 *
 * Features:
 * - Special values (NaN, Infinity)
 * - Mathematical constants (PI, E)
 * - Common numerical values (0, 1, -1, 10)
 * - Fractional values (1/2, 1/4)
 * - Large numbers (100, 1000, 1000000)
 *
 * All values are initialized once and reused throughout the application,
 * improving memory usage and performance.
 *
 * @example
 * ```typescript
 * // Special values
 * const nan = BigDecimalFlyweight.NaN;
 * const inf = BigDecimalFlyweight.POSITIVE_INFINITY;
 * const negInf = BigDecimalFlyweight.NEGATIVE_INFINITY;
 *
 * // Common numbers
 * const zero = BigDecimalFlyweight.ZERO;
 * const one = BigDecimalFlyweight.ONE;
 * const negOne = BigDecimalFlyweight.NEGATIVE_ONE;
 * const ten = BigDecimalFlyweight.TEN;
 *
 * // Mathematical constants
 * const pi = BigDecimalFlyweight.PI;
 * const e = BigDecimalFlyweight.E;
 *
 * // Fractions
 * const half = BigDecimalFlyweight.HALF;
 * const quarter = BigDecimalFlyweight.QUARTER;
 *
 * // Large numbers
 * const hundred = BigDecimalFlyweight.HUNDRED;
 * const thousand = BigDecimalFlyweight.THOUSAND;
 * const million = BigDecimalFlyweight.MILLION;
 * ```
 */
export abstract class BigDecimalFlyweight {
  /** Special values - initialized lazily */
  private static _NaN?: BigDecimalTypes.INaNDecimal;
  private static _POSITIVE_INFINITY?: BigDecimalTypes.IInfinityDecimal;
  private static _NEGATIVE_INFINITY?: BigDecimalTypes.IInfinityDecimal;

  /** Basic numerical values - cached for reuse */
  private static readonly _ZERO = DECIMAL_CONSTANTS.ZERO;
  private static readonly _NEGATIVE_ZERO = DECIMAL_CONSTANTS.NEGATIVE_ZERO;
  private static readonly _ONE = DECIMAL_CONSTANTS.ONE;
  private static readonly _NEGATIVE_ONE = DECIMAL_CONSTANTS.NEGATIVE_ONE;
  private static readonly _TEN = DECIMAL_CONSTANTS.TEN;

  /** Mathematical constants - high precision, cached values */
  private static readonly _PI = DECIMAL_CONSTANTS.PI;
  private static readonly _E = DECIMAL_CONSTANTS.E;

  /** Fractional values - commonly used fractions */
  private static readonly _HALF = DECIMAL_CONSTANTS.HALF;
  private static readonly _QUARTER = DECIMAL_CONSTANTS.QUARTER;

  /** Large numbers - frequently used in calculations */
  private static readonly _HUNDRED = DECIMAL_CONSTANTS.HUNDRED;
  private static readonly _THOUSAND = DECIMAL_CONSTANTS.THOUSAND;
  private static readonly _MILLION = DECIMAL_CONSTANTS.MILLION;

  /** Getters for special values */
  public static get NaN() {
    if (!this._NaN) {
      this._NaN = NaNDecimal.instance;
    }
    return this._NaN;
  }

  public static get POSITIVE_INFINITY() {
    if (!this._POSITIVE_INFINITY) {
      this._POSITIVE_INFINITY = InfinityDecimal.POSITIVE;
    }
    return this._POSITIVE_INFINITY;
  }

  public static get NEGATIVE_INFINITY() {
    if (!this._NEGATIVE_INFINITY) {
      this._NEGATIVE_INFINITY = InfinityDecimal.NEGATIVE;
    }
    return this._NEGATIVE_INFINITY;
  }

  /** Getters for cached values */
  public static get ZERO() {
    return BigDecimalCache.get(this._ZERO);
  }
  public static get NEGATIVE_ZERO() {
    return BigDecimalCache.get(this._NEGATIVE_ZERO);
  }
  public static get ONE() {
    return BigDecimalCache.get(this._ONE);
  }
  public static get NEGATIVE_ONE() {
    return BigDecimalCache.get(this._NEGATIVE_ONE);
  }
  public static get TEN() {
    return BigDecimalCache.get(this._TEN);
  }
  public static get PI() {
    return BigDecimalCache.get(this._PI);
  }
  public static get E() {
    return BigDecimalCache.get(this._E);
  }
  public static get HALF() {
    return BigDecimalCache.get(this._HALF);
  }
  public static get QUARTER() {
    return BigDecimalCache.get(this._QUARTER);
  }
  public static get HUNDRED() {
    return BigDecimalCache.get(this._HUNDRED);
  }
  public static get THOUSAND() {
    return BigDecimalCache.get(this._THOUSAND);
  }
  public static get MILLION() {
    return BigDecimalCache.get(this._MILLION);
  }
}
