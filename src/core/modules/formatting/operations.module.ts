import { BigDecimalConfiguration } from "@/core/config";
import { BigDecimalError } from "@/core/errors";

/**
 * Module providing formatting operations for decimals.
 * Implements various number formatting strategies with configurable options.
 *
 * Features:
 * - Fixed decimal places formatting
 * - Scientific notation
 * - Engineering notation
 * - Custom number grouping
 * - Configurable separators
 * - Prefix/suffix support
 *
 * @module FormattingModule
 */
export const formattingModule = (() => {
  /**
   * Validates decimal places against configuration limits
   * @throws {BigDecimalError} If decimals is invalid or exceeds configuration limit
   */
  const validateDecimals = (
    decimals: number,
    config: BigDecimalTypes.Config
  ): void => {
    if (!Number.isInteger(decimals)) {
      throw BigDecimalError.invalidArgument(
        "Decimal places must be an integer",
        {
          decimals,
        }
      );
    }
    if (decimals < 0) {
      throw BigDecimalError.invalidArgument("Decimal places must be >= 0", {
        decimals,
      });
    }
    if (decimals > config.DECIMAL_PLACES) {
      throw BigDecimalError.invalidConfig(
        `Maximum ${config.DECIMAL_PLACES} decimal places allowed`,
        {
          decimals,
          maxAllowed: config.DECIMAL_PLACES,
        }
      );
    }
  };

  /**
   * Determines if sign should be shown based on configuration
   */
  const shouldShowSign = (
    isZero: boolean,
    _sign: number,
    config: BigDecimalTypes.Config
  ): boolean => {
    return !isZero || (isZero && config.FORMAT.signedZero === true);
  };

  /**
   * Gets the sign prefix for the formatted number
   */
  const getSignPrefix = (
    isZero: boolean,
    sign: number,
    config: BigDecimalTypes.Config
  ): string => {
    return shouldShowSign(isZero, sign, config) && sign === -1 ? "-" : "";
  };

  /**
   * Formats the integer part with grouping
   */
  const formatIntegerPart = (
    digits: string,
    config: BigDecimalTypes.Config
  ): string => {
    if (!digits || !config.FORMAT.groupSize) return digits;

    const groups: string[] = [];
    let remaining = digits;
    const primarySize = config.FORMAT.groupSize;
    const secondarySize = config.FORMAT.secondaryGroupSize || primarySize;

    // Handle the first group which might be smaller
    const firstGroupSize =
      remaining.length % (secondarySize || primarySize) || secondarySize;
    if (remaining.length > firstGroupSize) {
      groups.push(remaining.slice(0, firstGroupSize));
      remaining = remaining.slice(firstGroupSize);
    }

    // Handle remaining groups
    while (remaining.length > 0) {
      const size = groups.length === 0 ? primarySize : secondarySize;
      groups.push(remaining.slice(0, size));
      remaining = remaining.slice(size);
    }

    return groups.join(config.FORMAT.groupSeparator);
  };

  /**
   * Formats the fraction part with grouping
   */
  const formatFractionPart = (
    digits: string,
    config: BigDecimalTypes.Config
  ): string => {
    if (!digits || !config.FORMAT.fractionGroupSize) return digits;

    const groups: string[] = [];
    for (let i = 0; i < digits.length; i += config.FORMAT.fractionGroupSize) {
      groups.push(digits.slice(i, i + config.FORMAT.fractionGroupSize));
    }

    return groups.join(config.FORMAT.fractionGroupSeparator);
  };

  /**
   * Wraps formatted number with prefix and suffix
   */
  const wrapWithFormat = (
    formattedNumber: string,
    config: BigDecimalTypes.Config
  ): string => {
    return config.FORMAT.prefix + formattedNumber + config.FORMAT.suffix;
  };

  /**
   * Handles exponential notation formatting
   */
  const formatExponential = (
    mantissa: string,
    exponent: number,
    _config: BigDecimalTypes.Config
  ): string => {
    return mantissa + "e" + (exponent >= 0 ? "+" : "") + exponent;
  };

  /**
   * Removes trailing zeros from bigint value and adjusts exponent accordingly.
   * Uses bitwise operations for performance.
   * @returns Tuple of [normalized value, adjusted exponent]
   */
  const normalizeTrailingZeros = (
    value: bigint,
    exp: number
  ): [bigint, number] => {
    if (value === 0n) return [0n, 0];

    let zeros = 0;
    while (value % 10n === 0n) {
      value /= 10n;
      zeros++;
    }
    return [value, exp + zeros];
  };

  // Public interface
  return {
    /**
     * Formats the decimal with fixed decimal places.
     *
     * @param decimals - Number of decimal places (default: 0)
     * @throws {BigDecimalError} If decimals is invalid or exceeds configuration limit
     * @returns Formatted string with fixed decimal places
     *
     * @example
     * ```typescript
     * decimal.toFixed(2)  // "123.46"
     * decimal.toFixed(0)  // "123"
     * ```
     */
    toFixed(
      this: BigDecimalTypes.IRegularDecimal,
      decimals: number = 0
    ): string {
      const config = BigDecimalConfiguration.get();
      validateDecimals(decimals, config);

      if (!this.value) return wrapWithFormat("0", config);

      const sign = getSignPrefix(this.isZero(), this.sign, config);
      let digits = this.value.toString();

      // Add leading zeros if needed
      const targetLength = -this.exp + decimals + 1;
      digits = digits.padStart(targetLength, "0");

      // Insert decimal point
      const insertAt = digits.length - decimals;
      if (decimals === 0) {
        return wrapWithFormat(sign + digits, config);
      }

      const integerPart = formatIntegerPart(
        insertAt <= 0 ? "0" : digits.slice(0, insertAt),
        config
      );
      const fractionPart = formatFractionPart(
        insertAt <= 0 ? "0".repeat(-insertAt) + digits : digits.slice(insertAt),
        config
      );

      return wrapWithFormat(
        sign + integerPart + config.FORMAT.decimalSeparator + fractionPart,
        config
      );
    },

    /**
     * Formats the decimal in scientific notation.
     *
     * @param decimals - Number of decimal places after the decimal point (default: 0)
     * @throws {BigDecimalError} If decimals is invalid or exceeds configuration limit
     * @returns Formatted string in scientific notation
     *
     * @example
     * ```typescript
     * decimal.toExponential(2)  // "1.23e+2"
     * decimal.toExponential()   // "1e+2"
     * ```
     */
    toExponential(
      this: BigDecimalTypes.IRegularDecimal,
      decimals?: number
    ): string {
      const config = BigDecimalConfiguration.get();
      // validateDecimals(decimals, config);

      if (!this.value) return wrapWithFormat("0e+0", config);

      // Normalize value and get adjusted exponent
      const [normalizedValue, adjustedExp] = normalizeTrailingZeros(
        this.value,
        this.exp
      );

      const sign = getSignPrefix(this.isZero(), this.sign, config);
      const digits = normalizedValue.toString();

      const firstDigit = digits[0];
      const restDigits = digits.slice(1, decimals ? decimals + 1 : undefined);
      const exp = digits.length - 1 + adjustedExp;

      const mantissa =
        firstDigit +
        (restDigits
          ? config.FORMAT.decimalSeparator + restDigits // + restDigits.padEnd(decimals, "0")
          : "");

      return wrapWithFormat(
        sign + formatExponential(mantissa, exp, config),
        config
      );
    },

    /**
     * Formats the decimal in engineering notation (exponent multiple of 3).
     *
     * @param decimals - Number of decimal places after the decimal point (default: 0)
     * @throws {BigDecimalError} If decimals is invalid or exceeds configuration limit
     * @returns Formatted string in engineering notation
     *
     * @example
     * ```typescript
     * decimal.toEngineering(2)  // "123.46e+0"
     * decimal.toEngineering()   // "123e+0"
     * ```
     */
    toEngineering(
      this: BigDecimalTypes.IRegularDecimal,
      decimals: number = 0
    ): string {
      const config = BigDecimalConfiguration.get();
      validateDecimals(decimals, config);

      if (!this.value) return wrapWithFormat("0e+0", config);

      const sign = getSignPrefix(this.isZero(), this.sign, config);
      const digits = this.value.toString();
      const scientificExp = digits.length - 1 + this.exp;
      const engExp = Math.floor(scientificExp / 3) * 3;
      const leftoverDigits = scientificExp - engExp + 1;

      const intPart = digits.slice(0, leftoverDigits);
      const fracPart =
        decimals > 0
          ? config.FORMAT.decimalSeparator +
            digits
              .slice(leftoverDigits, leftoverDigits + decimals)
              .padEnd(decimals, "0")
          : "";

      return wrapWithFormat(
        sign + formatExponential(intPart + fracPart, engExp, config),
        config
      );
    },

    /**
     * Returns the string representation of the decimal.
     * Uses exponential notation based on configuration thresholds.
     *
     * @returns Formatted string representation
     *
     * @example
     * ```typescript
     * decimal.toString()  // "123.46"
     * ```
     */
    toString(this: BigDecimalTypes.IRegularDecimal): string {
      const config = BigDecimalConfiguration.get();
      // if (!this.value) return wrapWithFormat("0", config);

      // Normalize value and get adjusted exponent
      const [normalizedValue, adjustedExp] = normalizeTrailingZeros(
        this.value,
        this.exp
      );

      const sign = getSignPrefix(this.isZero(), this.sign, config);
      const digits = normalizedValue.toString();

      // Handle exponential notation based on config
      const expAt = config.EXPONENTIAL_AT;
      const exp = digits.length - 1 + adjustedExp;
      const useExp = Array.isArray(expAt)
        ? exp <= expAt[0] || exp >= expAt[1]
        : Math.abs(exp) >= Math.abs(expAt);

      if (useExp) {
        return (
          this as unknown as BigDecimalTypes.IFormattingOperations
        ).toExponential();
      }

      if (adjustedExp === 0) {
        return wrapWithFormat(sign + digits, config);
      }

      if (adjustedExp > 0) {
        return wrapWithFormat(
          sign + formatIntegerPart(digits + "0".repeat(adjustedExp), config),
          config
        );
      }

      const insertAt = digits.length + adjustedExp;
      if (insertAt <= 0) {
        if (digits === "0") {
          return wrapWithFormat(sign + "0", config);
        }
        const fracDigits = "0".repeat(-insertAt) + digits;
        const trimmedFrac = fracDigits.replace(/0+$/, "");
        return trimmedFrac
          ? wrapWithFormat(
              sign +
                "0" +
                config.FORMAT.decimalSeparator +
                formatFractionPart(trimmedFrac, config),
              config
            )
          : wrapWithFormat(sign + "0", config);
      }

      const intPart = formatIntegerPart(digits.slice(0, insertAt), config);
      const fracDigits = digits.slice(insertAt);
      const trimmedFrac = fracDigits.replace(/0+$/, "");

      return wrapWithFormat(
        sign +
          intPart +
          (trimmedFrac
            ? config.FORMAT.decimalSeparator +
              formatFractionPart(trimmedFrac, config)
            : ""),
        config
      );
    },

    /**
     * Converts the decimal to a JavaScript number.
     *
     * @throws {BigDecimalError} If the value cannot be represented as a JavaScript number
     * @returns JavaScript number representation
     *
     * @example
     * ```typescript
     * decimal.toNumber()  // 123.46
     * ```
     */
    toNumber(this: BigDecimalTypes.IRegularDecimal): number {
      if (!this.value) return 0;

      const result = Number(this.value) * this.sign * Math.pow(10, this.exp);
      if (!Number.isFinite(result)) {
        throw BigDecimalError.outOfRange(
          "Value cannot be represented as a JavaScript number",
          {
            value: this.value,
            exp: this.exp,
            sign: this.sign,
          }
        );
      }
      return result;
    },
  } as const;
})();
