import { BigDecimalConfiguration } from "@/core/config";
import { BigDecimalError } from "@/core/errors";
import { errorHandlingModule } from "@/core/errors/error-handling.module";
import { RegularDecimal } from "@/core/implementations";
import { BigDecimalCache, BigDecimalFlyweight } from "@/core/performance";
import { parsingModule } from "@/core/modules/parsing";
import { validationModule } from "@/core/modules/validation";

/**
 * Factory class for creating decimal instances.
 * Provides a unified interface for creating decimals from various input types.
 *
 * Features:
 * - Handles all input types (number, string, boolean, bigint, etc.)
 * - Supports special values (NaN, Infinity)
 * - Validates and normalizes input
 * - Uses caching for common values
 * - Supports custom base (radix) for parsing
 * - Configurable preferences
 *
 * @example
 * ```typescript
 * // Primitive types
 * const num = BigDecimalFactory.create(123.45);     // Regular decimal
 * const str = BigDecimalFactory.create("123.45");   // From string
 * const bool = BigDecimalFactory.create(true);      // From boolean
 * const big = BigDecimalFactory.create(123n);       // From bigint
 *
 * // Special values
 * const inf = BigDecimalFactory.create(Infinity);   // Infinity
 * const nan = BigDecimalFactory.create(NaN);        // NaN
 * const nil = BigDecimalFactory.create(null);       // NaN
 *
 * // With custom base
 * const hex = BigDecimalFactory.create("FF", 16);   // Hexadecimal
 * const bin = BigDecimalFactory.create("1010", 2);  // Binary
 *
 * // Raw decimal value
 * const raw = BigDecimalFactory.create({
 *   value: 12345n,
 *   exp: -2,
 *   sign: 1
 * });
 *
 * // Existing BigDecimal
 * const copy = BigDecimalFactory.create(existingDecimal);
 * ```
 */
export class BigDecimalFactory {
  /**
   * Updates global configuration
   * @param config - Configuration object
   */
  static config(config: Partial<BigDecimalTypes.Config>): void {
    BigDecimalConfiguration.getInstance().updateConfig(config);
  }

  /**
   * Creates a decimal from any input value.
   * This is the main entry point for decimal creation.
   *
   * @param input - The input value to convert to a decimal
   * @param base - Base (radix) for parsing numbers (2-36)
   * @returns A decimal representation of the input
   * @throws {BigDecimalError} If the input format is invalid
   */
  static create(
    input: BigDecimalTypes.Input,
    base: BigDecimalTypes.BaseOrNull = BigDecimalConfiguration.get()
      .DEFAULT_BASE
  ): BigDecimalTypes.IBigDecimal {
    try {
      // Check input cache first for faster retrieval
      const cached = BigDecimalCache.getFromInputCache(input);
      if (cached) {
        return cached;
      }

      if (base === null) {
        base = BigDecimalConfiguration.get().DEFAULT_BASE;
      }

      // Validate base first
      // validationModule.validateBase(base);

      // Handle existing BigDecimal instances
      if (input instanceof RegularDecimal) {
        return input;
      }

      let result: BigDecimalTypes.IBigDecimal;

      // Handle raw decimal values
      if (
        typeof input === "object" &&
        "value" in input &&
        "exp" in input &&
        "sign" in input
      ) {
        validationModule.validateValue(input.value);
        validationModule.validateExp(input.exp);
        validationModule.validateSign(input.sign);
        result = RegularDecimal.fromRaw(input.value, input.exp, input.sign);
      } else if (typeof input === "boolean") {
        result = parsingModule.fromBoolean(input);
      } else if (typeof input === "number") {
        result = parsingModule.fromNumber(input, base);
      } else if (typeof input === "bigint") {
        result = parsingModule.fromBigInt(input, base);
      } else if (typeof input === "string") {
        result = parsingModule.fromString(input, base);
      } else {
        throw BigDecimalError.invalidFormat(input, { base });
      }

      // Cache the result with the input value
      BigDecimalCache.setToInputCache(input, result);
      return result;
    } catch (error) {
      return errorHandlingModule.handleValidationError(
        error,
        () => BigDecimalFlyweight.NaN
      );
    }
  }

  /**
   * Creates a decimal from any input value.
   * This is the main entry point for decimal creation.
   *
   * @param input - The input value to convert to a decimal
   * @param base - Base (radix) for parsing numbers (2-36)
   * @returns A decimal representation of the input
   * @throws {BigDecimalError} If the input format is invalid
   */
  static from(
    input: BigDecimalTypes.Input,
    base: BigDecimalTypes.BaseOrNull = BigDecimalConfiguration.get()
      .DEFAULT_BASE
  ): BigDecimalTypes.IBigDecimal {
    return this.create(input, base);
  }

  /**
   * Creates a decimal from any input value.
   * This is the main entry point for decimal creation.
   *
   * @param input - The input value to convert to a decimal
   * @param base - Base (radix) for parsing numbers (2-36)
   * @returns A decimal representation of the input
   * @throws {BigDecimalError} If the input format is invalid
   */
  static fr(
    input: BigDecimalTypes.Input,
    base: BigDecimalTypes.BaseOrNull = BigDecimalConfiguration.get()
      .DEFAULT_BASE
  ): BigDecimalTypes.IBigDecimal {
    return this.create(input, base);
  }

  // Initialize cache factory
  static {
    BigDecimalCache.setFactory((params) =>
      RegularDecimal.fromRaw(params.value, params.exp, params.sign)
    );
  }
}
