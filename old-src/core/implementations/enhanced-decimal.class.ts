import { AbstractBigDecimal } from "../base/abstract-decimal.class";
import {
  RegularBigDecimal,
  InfiniteBigDecimal,
  NaNBigDecimal,
} from "@/core/implementations";
import { BigDecimalTypes } from "../base/decimal-types.namespace";
import { ParserBigDecimal } from "@/old-src/modules/parsing";
import { BigDecimalErrors } from "@/old-src/errors";
import { BigDecimalConfiguration, type BigDecimalConfig } from "@/core/config";
import { isValidValue } from "@/old-src/utils/validation";

/**
 * Enhanced base class that handles all BigDecimal implementations
 * and provides smart instance creation. Extends AbstractBigDecimal with
 * additional factory methods and configuration management.
 */
export class EnhancedBigDecimal extends AbstractBigDecimal {
  /**
   * Static instances for special values
   */
  static readonly NaN = NaNBigDecimal.instance;
  static readonly POSITIVE_INFINITY = InfiniteBigDecimal.POSITIVE;
  static readonly NEGATIVE_INFINITY = InfiniteBigDecimal.NEGATIVE;
  static readonly zero = RegularBigDecimal.fromRawValues(0n, 0, 1);

  /** Alias for {@link create} method */
  static readonly from = EnhancedBigDecimal.create;

  /** Alias for {@link create} method */
  static readonly fr = EnhancedBigDecimal.create;

  /**
   * Protected instance properties
   */
  protected _sign: 1 | -1 | null = null;
  protected _value: bigint | null = null;
  protected _exp: number = 0;

  /**
   * Property getters
   */
  get sign(): typeof this._sign {
    return this._sign;
  }

  get value(): typeof this._value {
    return this._value;
  }

  get exp(): typeof this._exp {
    return this._exp;
  }

  /**
   * Configuration management methods
   */

  /**
   * Updates global configuration
   * @param config - Configuration object
   */
  static config(config: Partial<BigDecimalConfig.Preferences>): void {
    BigDecimalConfiguration.getInstance().config(config);
  }

  /**
   * Gets current configuration
   * @returns Current configuration
   */
  static getConfig(): Readonly<BigDecimalConfig.Preferences> {
    return BigDecimalConfiguration.getInstance().getConfig();
  }

  /**
   * Gets current configuration value
   * @param key - Configuration key
   * @returns Configuration value
   */
  protected static getConfigValue<K extends keyof BigDecimalConfig.Preferences>(
    key: K
  ): BigDecimalConfig.Preferences[K] {
    return this.getConfig()[key];
  }

  /**
   * Factory methods
   */

  /**
   * Smart factory method that returns appropriate BigDecimal implementation
   * @param value - Input value to convert to BigDecimal
   * @param base - Base for decimal places (default from configuration)
   * @returns Appropriate BigDecimal implementation instance
   */
  static create(
    value: BigDecimalTypes.Value,
    base: BigDecimalTypes.Base = this.getConfigValue("DEFAULT_BASE")
  ): RegularBigDecimal | InfiniteBigDecimal | NaNBigDecimal {
    try {
      // Handle existing BigDecimal instances
      if (value instanceof AbstractBigDecimal) {
        if (value.isNaN()) return this.NaN;
        if (value.isInfinite())
          return value.sign > 0
            ? this.POSITIVE_INFINITY
            : this.NEGATIVE_INFINITY;
        return value;
      }

      // Handle JavaScript special values
      if (typeof value === "number") {
        if (Number.isNaN(value)) return this.NaN;
        if (!Number.isFinite(value)) {
          return value > 0 ? this.POSITIVE_INFINITY : this.NEGATIVE_INFINITY;
        }
      }

      // Parse the input value
      const parseResult = ParserBigDecimal.parse(value, base);

      if ("type" in parseResult) {
        if (parseResult.type === "NaN") return this.NaN;
        return parseResult.sign > 0
          ? this.POSITIVE_INFINITY
          : this.NEGATIVE_INFINITY;
      }

      // Create RegularBigDecimal for normal numbers
      return RegularBigDecimal.fromRawValues(
        parseResult.value,
        parseResult.exp,
        parseResult.sign
      );
    } catch (error) {
      if (error instanceof Error) {
        throw BigDecimalErrors.invalidValue(value, {
          base,
          error: error.message,
        });
      }
      return this.NaN;
    }
  }

  /**
   * Creates a BigDecimal from raw components
   * @internal
   */
  protected static fromRawValues(
    value: bigint | null,
    exp: number,
    sign: 1 | -1 | null
  ): AbstractBigDecimal {
    if (value === null) {
      if (sign === null) return this.NaN;
      return sign > 0 ? this.POSITIVE_INFINITY : this.NEGATIVE_INFINITY;
    }
    return RegularBigDecimal.fromRawValues(value, exp, sign as 1 | -1);
  }

  /**
   * Utility methods
   */

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
   * Type guard methods
   */
  isNaN(): this is NaNBigDecimal {
    return this instanceof NaNBigDecimal;
  }

  isInfinite(): this is InfiniteBigDecimal {
    return this instanceof InfiniteBigDecimal;
  }

  isFinite(): this is RegularBigDecimal {
    return this instanceof RegularBigDecimal;
  }

  /**
   * Conversion methods
   */
  valueOf(): number {
    if (this.isNaN()) return NaN;
    if (this.isInfinite()) return this.sign > 0 ? Infinity : -Infinity;
    throw new Error("Method must be implemented by concrete classes");
  }

  toString(): string {
    if (this.isNaN()) return "NaN";
    if (this.isInfinite()) return this.sign > 0 ? "Infinity" : "-Infinity";
    throw new Error("Method must be implemented by concrete classes");
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
