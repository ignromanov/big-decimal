import { BigDecimalConfiguration } from "@/core/config";
import { BigDecimalError } from "@/core/errors";
import { BigDecimalCache, BigDecimalFlyweight } from "@/core/performance";

/**
 * Module providing parsing operations for decimals.
 * Implements various parsing strategies for different input types.
 *
 * Features:
 * - Number parsing
 * - String parsing (decimal and scientific notation)
 * - Boolean parsing
 * - BigInt parsing
 * - Special values handling (NaN, Infinity)
 * - Base conversion support
 * - Configurable range handling
 *
 * @module ParsingModule
 */
export const parsingModule = (() => {
  /**
   * Regular expression for matching special values (NaN, Infinity)
   */
  const SPECIAL_VALUES_REGEX = /^[+-]?(Infinity|NaN)$/;

  /**
   * Regular expression for matching decimal strings
   */
  const DECIMAL_STRING_REGEX = /^[+-]?(?:\d*\.?\d+|\d+\.?|\.?\d+)$/;

  /**
   * Regular expression for matching scientific notation
   */
  const SCIENTIFIC_NOTATION_REGEX = /^([+-]?)(\d*)(\.(\d*))?[eE]([+-]?\d+)$/;

  /**
   * Regular expression for matching whitespace
   */
  const WHITESPACE = /\s*/g;

  /**
   * Regular expression for matching leading and trailing zeros
   */
  // const TRIM_ZEROS_REGEX = /^0+|0+$/g;

  /**
   * Regular expression for matching leading zeros
   */
  const LEADING_ZEROS_REGEX = /^0*/;

  /**
   * Attempts to parse string as special value (NaN/Infinity)
   */
  const parseSpecialValue = (
    value: string
  ): BigDecimalTypes.ISpecialDecimal | null => {
    const match = value.match(SPECIAL_VALUES_REGEX);
    if (!match) return null;

    if (value.includes("NaN")) {
      return BigDecimalFlyweight.NaN;
    }
    return value.startsWith("-")
      ? BigDecimalFlyweight.NEGATIVE_INFINITY
      : BigDecimalFlyweight.POSITIVE_INFINITY;
  };

  /**
   * Attempts to parse string as regular decimal number
   */
  const tryParseDecimalString = (
    value: string,
    base: BigDecimalTypes.Base
  ): BigDecimalTypes.IBigDecimal | undefined => {
    const match = DECIMAL_STRING_REGEX.exec(value);
    if (!match) return undefined;

    // Get full match
    const [fullMatch] = match;
    const isNegative = fullMatch.startsWith("-");

    // Remove sign for further processing
    const unsigned = fullMatch.replace(/^[+-]/, "");

    // Split into integer and fractional parts
    const [intPart = "", fracPart = ""] = unsigned.split(".");

    // Handle special cases with zeros
    if (!intPart && !fracPart) {
      return BigDecimalFlyweight.ZERO;
    }

    try {
      // Remove leading zeros, but keep one zero if the number is zero
      const valueStr = (intPart + fracPart).replace(/^0+(?=\d)/, "");

      return BigDecimalCache.get({
        value: BigInt(valueStr),
        exp: fracPart ? -fracPart.length : 0,
        sign: isNegative ? -1 : 1,
      });
    } catch (error) {
      if (error instanceof BigDecimalError) throw error;
      throw BigDecimalError.invalidFormat(value, {
        error,
        format: "decimal",
        base,
      });
    }
  };

  /**
   * Attempts to parse string as scientific notation
   */
  const tryParseScientificNotation = (
    value: string,
    base: BigDecimalTypes.Base
  ): BigDecimalTypes.IBigDecimal | undefined => {
    // Scientific notation is only supported in base 10
    if (base !== 10) return undefined;

    const match = SCIENTIFIC_NOTATION_REGEX.exec(value);
    if (!match) return undefined;

    try {
      const [, sign, intPart, , fracPart = "", exponent] = match;
      const isNegative = sign === "-";

      // Handle empty integer part (e.g., ".123e5")
      const normalizedIntPart = intPart || "0";

      // Combine integer and fractional parts
      const fullNumber = normalizedIntPart + fracPart;
      if (!fullNumber) {
        return BigDecimalFlyweight.ZERO;
      }

      // Remove leading zeros but keep one if it's zero
      const valueStr = fullNumber.replace(/^0+(?=\d)/, "") || "0";

      // Convert to bigint directly to preserve precision
      const value = BigInt(valueStr);

      // Calculate final exponent
      const expNumber = parseInt(exponent, 10);
      const finalExp = expNumber - fracPart.length;

      // Get configuration range limits
      const config = BigDecimalConfiguration.get();

      // Calculate the order of magnitude
      const magnitude = valueStr.length - 1 + finalExp;

      // Check range limits
      const [minPowerRange, maxPowerRange] = config.POWER_RANGE;
      // const maxOrder = Math.floor(Math.log10(maxPowerRange));
      // const minOrder = Math.floor(Math.log10(Math.abs(minPowerRange)));
      // const order = Math.floor(Math.log10(magnitude));

      if (magnitude > maxPowerRange) {
        return isNegative
          ? BigDecimalFlyweight.NEGATIVE_INFINITY
          : BigDecimalFlyweight.POSITIVE_INFINITY;
      }

      if (magnitude < 0 && magnitude < minPowerRange) {
        return BigDecimalFlyweight.ZERO;
      }

      return BigDecimalCache.get({
        value,
        exp: finalExp,
        sign: isNegative ? -1 : 1,
      });
    } catch (error) {
      if (error instanceof BigDecimalError) throw error;
      throw BigDecimalError.invalidFormat(value, {
        error,
        format: "scientific",
        base,
      });
    }
  };

  // Public interface
  return {
    /**
     * Creates a decimal from a number.
     *
     * @param num - Input number
     * @param base - Base for conversion (2-36, default: 10)
     * @returns Decimal representation of the number
     *
     * @example
     * ```typescript
     * fromNumber(123.45)    // Regular number
     * fromNumber(NaN)       // NaN
     * fromNumber(Infinity)  // Positive infinity
     * ```
     */
    fromNumber(
      num: number,
      _base: BigDecimalTypes.Base
    ): BigDecimalTypes.IBigDecimal {
      // Handle special cases
      if (Number.isNaN(num)) return BigDecimalFlyweight.NaN;
      if (!Number.isFinite(num)) {
        return num > 0
          ? BigDecimalFlyweight.POSITIVE_INFINITY
          : BigDecimalFlyweight.NEGATIVE_INFINITY;
      }

      if (num === 0)
        return Object.is(num, -0)
          ? BigDecimalFlyweight.NEGATIVE_ZERO
          : BigDecimalFlyweight.ZERO;

      // Convert to string and get sign
      const stringValue = num.toString().replace(LEADING_ZEROS_REGEX, "");
      const isNegative = stringValue.charAt(0) === "-";
      let numericPart = isNegative ? stringValue.slice(1) : stringValue;

      // Find decimal point
      let decimalPosition = numericPart.indexOf(".");
      if (decimalPosition > -1) {
        numericPart = numericPart.replace(".", "");
      }

      // Handle exponential notation
      const exponentialPosition = numericPart.toLowerCase().indexOf("e");
      if (exponentialPosition > 0) {
        if (decimalPosition < 0) decimalPosition = exponentialPosition;
        decimalPosition += parseInt(
          numericPart.slice(exponentialPosition + 1),
          10
        );
        numericPart = numericPart.substring(0, exponentialPosition);
      } else if (decimalPosition < 0) {
        decimalPosition = numericPart.length;
      }

      // Remove leading and trailing zeros
      // numericPart = numericPart.replace(TRIM_ZEROS_REGEX, "");

      // Handle zero case
      if (!numericPart) {
        return isNegative
          ? BigDecimalFlyweight.NEGATIVE_ZERO
          : BigDecimalFlyweight.ZERO;
      }

      const finalExponent = decimalPosition - numericPart.length;

      // Check for underflow
      const [minPowerRange] = BigDecimalConfiguration.get().POWER_RANGE;
      if (finalExponent < minPowerRange) {
        return isNegative
          ? BigDecimalFlyweight.NEGATIVE_ZERO
          : BigDecimalFlyweight.ZERO;
      }

      return BigDecimalCache.get({
        value: BigInt(numericPart),
        exp: finalExponent,
        sign: isNegative ? -1 : 1,
      });
    },

    /**
     * Creates a decimal from a string.
     * Supports regular decimal notation, scientific notation, and special values.
     *
     * @param value - Input string
     * @param base - Base for conversion (2-36, default: 10)
     * @throws {BigDecimalError} If string format is invalid
     * @returns Decimal representation of the string
     *
     * @example
     * ```typescript
     * fromString("123.45")    // Regular decimal
     * fromString("1.23e-4")   // Scientific notation
     * fromString("Infinity")   // Special value
     * fromString("FF", 16)    // Hexadecimal
     * ```
     */
    fromString(
      value: string,
      base: BigDecimalTypes.Base
    ): BigDecimalTypes.IBigDecimal {
      const normalizedValue = value.replace(WHITESPACE, "");
      if (!normalizedValue) {
        throw BigDecimalError.invalidFormat(value, {
          reason: "Empty string or whitespace only",
        });
      }

      const specialValue = parseSpecialValue(normalizedValue);
      if (specialValue) return specialValue;

      const result =
        tryParseDecimalString(normalizedValue, base) ||
        tryParseScientificNotation(normalizedValue, base);

      if (!result) {
        throw BigDecimalError.invalidFormat(value, {
          reason: "Invalid string format",
          base,
        });
      }

      return result;
    },

    /**
     * Creates a decimal from a boolean.
     *
     * @param value - Input boolean
     * @returns Decimal representation (1 for true, 0 for false)
     *
     * @example
     * ```typescript
     * fromBoolean(true)   // 1
     * fromBoolean(false)  // 0
     * ```
     */
    fromBoolean(value: boolean): BigDecimalTypes.IBigDecimal {
      return value ? BigDecimalFlyweight.ONE : BigDecimalFlyweight.ZERO;
    },

    /**
     * Creates a decimal from a bigint.
     *
     * @param value - Input bigint
     * @param base - Base for conversion (2-36, default: 10)
     * @returns Decimal representation of the bigint
     *
     * @example
     * ```typescript
     * fromBigInt(123n)     // Regular bigint
     * fromBigInt(-456n)    // Negative bigint
     * ```
     */
    fromBigInt(
      value: bigint,
      _base: BigDecimalTypes.Base
    ): BigDecimalTypes.IBigDecimal {
      return BigDecimalCache.get({
        value: value < 0n ? -value : value,
        exp: 0,
        sign: value < 0n ? -1 : 1,
      });
    },
  } as const;
})();
