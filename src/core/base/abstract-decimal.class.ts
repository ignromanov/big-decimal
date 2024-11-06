import { InfiniteBigDecimal, NaNBigDecimal, RegularBigDecimal } from "@/core";
import { BigDecimalConfiguration, type BigDecimalConfig } from "@/core/config";
import { BigDecimalError, BigDecimalErrors } from "@/errors";
import type { BigDecimalTypes } from "@/index";
import { ParserBigDecimal } from "@/utils/parsing";
import { isValidValue, validateSign } from "@/utils/validation";
import {
  absoluteValue,
  compareTo,
  div,
  isNegative,
  isPositive,
  isZero,
  minus,
  multipliedBy,
  negate,
  plus,
  pow,
  round,
  sqrt,
  toFixed,
} from "./abstract-decimal.methods";

/**
 * Abstract base class for arbitrary-precision decimal arithmetic.
 * Provides a foundation for different implementations:
 * - {@link RegularBigDecimal} - Regular decimal numbers
 * - {@link NaNBigDecimal} - Not a Number representation
 * - {@link InfiniteBigDecimal} - Positive and Negative Infinity
 *
 * @example
 * ```ts
 * const num = BigDecimal.from("123.456"); // Creates regular BigDecimal
 * const inf = BigDecimal.POSITIVE_INFINITY; // Gets Infinity instance
 * const nan = BigDecimal.NaN; // Gets NaN instance
 * ```
 *
 * @remarks
 * This class implements basic arithmetic operations, comparisons, and formatting.
 * All operations preserve precision and handle special cases (NaN, Infinity).
 */
export abstract class BigDecimal {
  /**
   * Alias for {@link create} method
   * @readonly
   */
  static readonly from = BigDecimal.create;

  /**
   * Alias for {@link create} method
   * @readonly
   */
  static readonly fr = BigDecimal.create;

  /** Sign of the number (1 for positive, -1 for negative, null for NaN) */
  protected _sign: 1 | -1 | null = null;

  /** The numerical value stored as a bigint (without sign and exponent) or null for special values */
  protected _value: bigint | null = null;

  /** Exponent of the number */
  protected _exp: number = 0;

  /**
   * Gets the sign of the number
   * @readonly
   */
  get sign(): typeof this._sign {
    return this._sign;
  }

  /**
   * Gets the numerical value
   * @readonly
   */
  get value(): typeof this._value {
    return this._value;
  }

  /**
   * Gets the exponent of the number
   * @readonly
   */
  get exp(): typeof this._exp {
    return this._exp;
  }

  /**
   * Singleton instance representing NaN (Not a Number)
   * @readonly
   */
  static get NaN(): BigDecimal {
    return NaNBigDecimal.instance;
  }

  /**
   * Singleton instance representing positive infinity
   * @readonly
   */
  static get POSITIVE_INFINITY(): BigDecimal {
    return InfiniteBigDecimal.POSITIVE;
  }

  /**
   * Singleton instance representing negative infinity
   * @readonly
   */
  static get NEGATIVE_INFINITY(): BigDecimal {
    return InfiniteBigDecimal.NEGATIVE;
  }

  /**
   * Constant representing zero
   * @readonly
   */
  static get zero(): BigDecimal {
    return BigDecimal.create(0);
  }

  /**
   * Updates global configuration
   * @param config - Configuration object
   */
  static config(config: Partial<BigDecimalConfig.Config>): void {
    BigDecimalConfiguration.getInstance().config(config);
  }

  /**
   * Gets current configuration
   * @returns Current configuration
   */
  static getConfig(): Readonly<BigDecimalConfig.Config> {
    return BigDecimalConfiguration.getInstance().getConfig();
  }

  /**
   * Gets current configuration value
   * @param key - Configuration key
   * @returns Configuration value
   */
  protected static getConfigValue<K extends keyof BigDecimalConfig.Config>(
    key: K
  ): BigDecimalConfig.Config[K] {
    return this.getConfig()[key];
  }
  /**
   * Factory method to create appropriate BigDecimal instance based on input value
   * @param value - Input value to convert
   * @param scale - Number of decimal places to maintain
   * @returns Appropriate BigDecimal implementation
   *
   * @example
   * ```ts
   * BigDecimal.create(NaN) // Returns NaNBigDecimal
   * BigDecimal.create(Infinity) // Returns InfiniteBigDecimal
   * BigDecimal.create("123.45") // Returns BigDecimal
   * ```
   */
  static create(
    value: BigDecimalTypes.Value,
    base: BigDecimalTypes.Base = BigDecimal.getConfigValue("DEFAULT_BASE")
  ): BigDecimal {
    try {
      const parseResult = ParserBigDecimal.parse(value, base);

      if ("type" in parseResult) {
        if (parseResult.type === "NaN") return BigDecimal.NaN;
        return parseResult.sign > 0
          ? BigDecimal.POSITIVE_INFINITY
          : BigDecimal.NEGATIVE_INFINITY;
      }

      return RegularBigDecimal.fromRawValues(
        parseResult.value,
        parseResult.exp,
        parseResult.sign
      );
    } catch (error) {
      if (error instanceof BigDecimalError) throw error;
      throw BigDecimalErrors.invalidValue(value, {
        base,
        error: String(error),
      });
    }
  }

  /**
   * Creates a BigDecimal from raw components
   * @internal
   */
  protected static fromRawValues(
    value: typeof BigDecimal.prototype.value,
    exp: typeof BigDecimal.prototype.exp,
    sign: typeof BigDecimal.prototype.sign
  ): BigDecimal {
    if (value === null) {
      if (sign === null) return BigDecimal.NaN;
      return sign > 0
        ? BigDecimal.POSITIVE_INFINITY
        : BigDecimal.NEGATIVE_INFINITY;
    }
    validateSign(sign);
    // validateRawValues(value, exp, sign);
    return RegularBigDecimal.fromRawValues(value, exp, sign);
  }

  /**
   * Checks if a value is valid for creating a BigDecimal instance
   * @param value - Value to check
   * @returns True if value can be converted to BigDecimal
   */
  static isValid(value: unknown): boolean {
    return isValidValue(value);
  }

  /**
   * Calculates scale factor for given number of decimal places
   * @internal
   */
  protected baseFactor(base: number): bigint {
    return BigInt(base);
  }

  /**
   * Type guard to check if value is NaN
   * @returns True if this is NaNBigDecimal
   * @public
   */
  isNaN(): this is NaNBigDecimal {
    return this instanceof NaNBigDecimal;
  }

  /**
   * Type guard to check if value is Infinite
   * @returns True if this is InfiniteBigDecimal
   * @public
   */
  isInfinite(): this is InfiniteBigDecimal {
    return this instanceof InfiniteBigDecimal;
  }

  /**
   * Type guard to check if value is Finite
   * @returns True if this is regular BigDecimal
   * @public
   */
  isFinite(): this is RegularBigDecimal {
    return this instanceof RegularBigDecimal;
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

  /**
   * Converts value to number
   * @returns Number representation
   * @throws {Error} If value cannot be converted to number
   *
   * @example
   * ```ts
   * const a = BigDecimal.from("1.23");
   * const n = a.valueOf(); // 1.23
   * ```
   */
  valueOf(): number {
    throw BigDecimalErrors.notImplemented("valueOf");
  }

  plus = plus;
  minus = minus;
  multipliedBy = multipliedBy;
  times = multipliedBy;
  div = div;
  pow = pow;
  sqrt = sqrt;
  absoluteValue = absoluteValue;
  abs = absoluteValue;
  negate = negate;
  compareTo = compareTo;
  isZero = isZero;
  isPositive = isPositive;
  isNegative = isNegative;
  toString = toString;
  toFixed = toFixed;
  round = round;
}
