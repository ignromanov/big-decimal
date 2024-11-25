import { AbstractDecimal } from "./abstract.decimal";

/**
 * Base class for special decimal values (NaN and Infinity).
 * Implements common functionality for special values that cannot be represented
 * as regular decimal numbers.
 *
 * @remarks
 * Special decimals include:
 * - {@link NaNDecimal} - Not a Number representation
 * - {@link InfinityDecimal} - Positive and Negative Infinity
 *
 * These values have null as their numerical value and specific behaviors
 * for arithmetic operations.
 *
 * @example
 * ```typescript
 * const infinity = new InfinityDecimal(1); // Positive infinity
 * const nan = new NaNDecimal(); // NaN
 * ```
 */
export abstract class SpecialDecimal
  extends AbstractDecimal
  implements BigDecimalTypes.ISpecialDecimal
{
  /** Special values always have null as their numerical value */
  protected _value: null = null;

  /** Sign depends on the specific implementation */
  protected abstract _sign: 1 | -1 | null;

  /** Special values use 0 as their exponent */
  protected _exp: number = 0;

  /** @returns Always null for special values */
  get value() {
    return this._value;
  }

  /** @returns Sign of the special value (null for NaN, ±1 for Infinity) */
  get sign() {
    return this._sign;
  }

  /** @returns Always 0 for special values */
  get exp() {
    return this._exp;
  }

  /**
   * @returns Always false as special values are not regular decimals
   */
  isRegular(): this is BigDecimalTypes.IRegularDecimal {
    return false;
  }

  /**
   * @returns Always false as special values are not finite
   */
  isFinite(): this is BigDecimalTypes.IRegularDecimal {
    return false;
  }

  /** Type guard for NaN check */
  abstract isNaN(): this is BigDecimalTypes.INaNDecimal;

  /** Type guard for Infinity check */
  abstract isInfinite(): this is BigDecimalTypes.IInfinityDecimal;

  /** Converts to primitive number representation */
  abstract valueOf(): number;

  /** Converts to string representation */
  abstract toString(): string;
}
