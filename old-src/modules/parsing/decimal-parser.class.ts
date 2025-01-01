import { BigDecimal, type BigDecimalTypes } from "@/core";
import { BigDecimalConfiguration } from "@/core/config";
import { BigDecimalErrors } from "@/old-src/errors";
import type { ParseResult, SpecialValue } from "./types";

/**
 * Parser for converting various input formats to BigDecimal components.
 * Handles regular numbers, scientific notation, and special values (NaN, Infinity).
 *
 * @example
 * ```ts
 * // Parse regular number
 * ParserBigDecimal.parse("123.456") // { value: 123456n, exp: -3, sign: 1 }
 *
 * // Parse scientific notation
 * ParserBigDecimal.parse("1.23e2") // { value: 123n, exp: 0, sign: 1 }
 *
 * // Parse special values
 * ParserBigDecimal.parse("Infinity") // { type: "Infinity", sign: 1 }
 * ParserBigDecimal.parse("NaN") // { type: "NaN" }
 * ```
 */
export class ParserBigDecimal {
  /** Matches special values like "Infinity", "-Infinity", "NaN" */
  private static readonly SPECIAL_VALUES_REGEX = /^[+-]?(Infinity|NaN)$/;

  /** Matches leading/trailing whitespace */
  private static readonly WHITESPACE = /^\s*|\s+$/g;

  /** Matches decimal numbers including various zero representations */
  private static readonly DECIMAL_STRING_REGEX =
    /^[+-]?(?:\d*\.?\d+|\d+\.?|\.?\d+)$/;

  /** Matches scientific notation like "1.23e-4" */
  private static readonly SCIENTIFIC_NOTATION_REGEX =
    /^([+-]?)(\d*)(\.(\d*))?[eE]([+-]?\d+)$/;

  private static readonly config = BigDecimalConfiguration.getInstance();

  /**
   * Checks if number exceeds configured range
   */
  private static checkRange(
    value: bigint,
    exp: number
  ): ParseResult | SpecialValue {
    const config = this.config.getConfig();
    const [minRange, maxRange] = config.RANGE;

    // Check effective value with exponent
    const effectiveValue = this.calculateEffectiveValue(value, exp);

    if (effectiveValue === 0n) {
      return { value: 0n, exp: 0, sign: 1 };
    }

    if (effectiveValue > BigInt(maxRange)) {
      return { type: "Infinity", sign: 1 };
    }
    if (effectiveValue < BigInt(minRange)) {
      return { type: "Infinity", sign: -1 };
    }

    return { value, exp, sign: 1 };
  }

  private static calculateEffectiveValue(value: bigint, exp: number): bigint {
    // Calculate effective value with exponent
    if (exp >= 0) {
      return value * 10n ** BigInt(exp);
    } else {
      return value / 10n ** BigInt(-exp);
    }
  }

  /**
   * Safely evaluates scientific notation without actual computation
   */
  private static evaluateScientificMagnitude(
    intPart: string,
    fracPart: string,
    exponent: string
  ): "overflow" | "underflow" | "valid" {
    const totalDigits = intPart.length + fracPart.length;
    const exp = parseInt(exponent, 10);

    // Calculate final number of digits after moving decimal point
    const finalDigits = totalDigits + exp;
    const config = this.config.getConfig();

    // Check against range limits
    const [minRange, maxRange] = config.RANGE;
    const _minDigits = Math.floor(Math.log10(Math.abs(minRange))) + 1;
    const maxDigits = Math.floor(Math.log10(Math.abs(maxRange))) + 1;

    if (finalDigits > maxDigits) return "overflow";
    if (finalDigits < -config.DECIMAL_PLACES) return "underflow";

    return "valid";
  }

  /**
   * Main entry point for parsing any supported value type
   * @param value - Value to parse (string, number, bigint, or BigDecimal)
   * @param base - Base of the number system
   * @returns Parsed components or special value indicator
   * @throws {BigDecimalError} If value format is invalid
   */
  static parse(
    value: BigDecimalTypes.Value,
    base: BigDecimalTypes.Base
  ): ParseResult | SpecialValue {
    // Handle special cases first
    if (value instanceof BigDecimal) {
      return this.parseFromBigDecimal(value);
    }

    if (typeof value === "object" && value !== null && "value" in value) {
      return this.parseFromRawValues(value as BigDecimalTypes.RawValues);
    }

    if (typeof value === "string") {
      return this.parseFromString(value, base);
    }

    if (typeof value === "number") {
      return this.parseFromNumber(value, base);
    }

    if (typeof value === "bigint") {
      return this.parseFromBigInt(value, base);
    }

    throw BigDecimalErrors.invalidValue(value, { base });
  }

  /**
   * Parses string input, handling special values and number formats
   * @param originalValue - Raw string input
   * @param base - Base of the number system
   * @returns Parsed components or special value indicator
   * @throws {BigDecimalError} If string format is invalid
   */
  private static parseFromString(
    originalValue: string,
    base: BigDecimalTypes.Base
  ): ParseResult | SpecialValue {
    const value = originalValue.replace(this.WHITESPACE, "");

    const specialValue = this.parseSpecialValue(value);
    if (specialValue) return specialValue;

    const result =
      this.tryParseDecimalString(value, base) ||
      this.tryParseScientificNotation(value, base);

    if (!result) {
      throw BigDecimalErrors.invalidValue(originalValue, { base });
    }
    return result;
  }

  /**
   * Attempts to parse string as special value (NaN/Infinity)
   * @param value - Normalized string input
   * @returns Special value object if matched, null otherwise
   */
  private static parseSpecialValue(value: string): SpecialValue | null {
    const match = value.match(this.SPECIAL_VALUES_REGEX);
    if (!match) return null;

    if (value.includes("NaN")) {
      return { type: "NaN" };
    }
    return {
      type: "Infinity",
      sign: value.startsWith("-") ? -1 : 1,
    };
  }

  /**
   * Converts existing BigDecimal instance to raw components
   * @param value - BigDecimal instance
   * @returns Original components or special value indicator
   */
  private static parseFromBigDecimal(
    value: BigDecimal
  ): ParseResult | SpecialValue {
    if (value.isNaN()) return { type: "NaN" };
    if (value.isInfinite()) {
      return {
        type: "Infinity",
        sign: value.sign,
      };
    }
    if (value.isFinite()) {
      return {
        value: value.value,
        exp: value.exp,
        sign: value.sign,
      };
    }
    throw BigDecimalErrors.invalidValue(value);
  }

  /**
   * Parses number input, handling special cases and decimal places
   * @param value - Number to parse
   * @param base - Base of the number system
   * @returns Parsed components or special value indicator
   */
  private static parseFromNumber(
    value: number,
    _base: BigDecimalTypes.Base
  ): ParseResult | SpecialValue {
    if (Number.isNaN(value)) return { type: "NaN" };
    if (!Number.isFinite(value)) {
      return {
        type: "Infinity",
        sign: value > 0 ? 1 : -1,
      };
    }

    // Convert to string and parse
    const str = Math.abs(value).toString();
    const [intPart, fracPart = ""] = str.split(".");

    // Collect all digits together and remove leading zeros
    const valueStr = (intPart + fracPart).replace(/^0+(?=\d)/, "");

    return {
      value: BigInt(valueStr),
      exp: fracPart ? -fracPart.length : 0,
      sign: value < 0 ? -1 : 1,
    };
  }

  /**
   * Converts bigint to decimal components
   * @param value - BigInt value
   * @param base - Base of the number system
   * @returns Parsed components
   */
  private static parseFromBigInt(
    value: bigint,
    _base: BigDecimalTypes.Base
  ): ParseResult {
    return {
      value: value < 0n ? -value : value,
      exp: 0,
      sign: value < 0n ? -1 : 1,
    };
  }

  /**
   * Attempts to parse string as regular decimal number
   * @param value - Normalized string input
   * @param base - Base of the number system
   * @returns Parsed components if successful, null if format doesn't match
   */
  static tryParseDecimalString(
    value: string,
    base: BigDecimalTypes.Base
  ): ParseResult | SpecialValue | null {
    const match = this.DECIMAL_STRING_REGEX.exec(value);
    if (!match) return null;

    // Get full match
    const [fullMatch] = match;
    const isNegative = fullMatch.startsWith("-");

    // Remove sign for further processing
    const unsigned = fullMatch.replace(/^[+-]/, "");

    // Split into integer and fractional parts
    const [intPart = "", fracPart = ""] = unsigned.split(".");

    // Handle special cases with zeros
    if (!intPart && !fracPart) {
      return {
        value: 0n,
        exp: 0,
        sign: 1,
      };
    }

    try {
      // Remove leading zeros, but keep one zero if the number is zero
      const valueStr = (intPart + fracPart).replace(/^0+(?=\d)/, "");

      // Calculate exponent
      let exp = 0;
      if (fracPart) {
        exp = -fracPart.length;
      }

      return {
        value: BigInt(valueStr),
        exp,
        sign: isNegative ? -1 : 1,
      };
    } catch {
      throw BigDecimalErrors.invalidValue(value, { base });
    }
  }

  /**
   * Attempts to parse string as scientific notation
   * @param value - Normalized string input
   * @param base - Base of the number system
   * @returns Parsed components if successful, null if format doesn't match
   */
  static tryParseScientificNotation(
    value: string,
    base: BigDecimalTypes.Base
  ): ParseResult | SpecialValue | null {
    // Scientific notation is only supported in base 10
    if (base !== 10) return null;

    const match = this.SCIENTIFIC_NOTATION_REGEX.exec(value);
    if (!match) return null;

    const [, sign, intPart, , fracPart = "", exponent] = match;
    const isNegative = sign === "-";

    // Safe magnitude evaluation
    const magnitude = this.evaluateScientificMagnitude(
      intPart,
      fracPart,
      exponent
    );

    switch (magnitude) {
      case "overflow":
        return {
          type: "Infinity",
          sign: isNegative ? -1 : 1,
        };
      case "underflow":
        return {
          value: 0n,
          exp: 0,
          sign: isNegative ? -1 : 1,
        };
      case "valid":
        try {
          const baseNumber = BigInt(intPart + fracPart);
          const fractionLength = BigInt(fracPart.length);
          const expNumber = parseInt(exponent, 10);

          // Calculate final exponent
          const finalExp = expNumber - fracPart.length;

          return {
            value: baseNumber,
            exp: finalExp,
            sign: isNegative ? -1 : 1,
          };
        } catch {
          throw BigDecimalErrors.invalidValue(value, { base });
        }
    }
  }

  /**
   * Parses raw values object
   */
  private static parseFromRawValues(
    raw: BigDecimalTypes.RawValues
  ): ParseResult | SpecialValue {
    if (raw.value === null) {
      if (raw.sign === null) return { type: "NaN" };
      return { type: "Infinity", sign: raw.sign };
    }

    return {
      value: raw.value,
      exp: raw.exp,
      sign: raw.sign as 1 | -1,
    };
  }
}
