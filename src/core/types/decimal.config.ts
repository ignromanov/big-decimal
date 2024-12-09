/**
 * Configuration preferences for decimal operations.
 * Controls the behavior of mathematical operations, formatting, and error handling.
 */
export interface Config {
  /**
   * Maximum number of decimal places for operations involving division.
   * Used in division, square root, and base conversion operations.
   * @default 20
   * @range 0 to 1e+9
   */
  DECIMAL_PLACES: number;

  /**
   * Rounding mode used for operations.
   * Controls how numbers are rounded in various operations.
   * @default 4 (ROUND_HALF_UP)
   * @values
   * - 0: ROUND_UP - Rounds away from zero
   * - 1: ROUND_DOWN - Rounds towards zero
   * - 2: ROUND_CEIL - Rounds towards Infinity
   * - 3: ROUND_FLOOR - Rounds towards -Infinity
   * - 4: ROUND_HALF_UP - Rounds towards nearest neighbor, ties away from zero
   * - 5: ROUND_HALF_DOWN - Rounds towards nearest neighbor, ties towards zero
   * - 6: ROUND_HALF_EVEN - Rounds towards nearest neighbor, ties towards even neighbor
   * - 7: ROUND_HALF_CEIL - Rounds towards nearest neighbor, ties towards Infinity
   * - 8: ROUND_HALF_FLOOR - Rounds towards nearest neighbor, ties towards -Infinity
   */
  ROUNDING_MODE: number;

  /**
   * Exponent value(s) at which toString returns exponential notation.
   * Can be a single number for magnitude, or an array for separate positive/negative thresholds.
   * @default [-7, 20]
   * @example
   * - [-7, 20] matches JavaScript number behavior
   * - 20 uses exponential notation for values ≥1e+20 or ≤1e-20
   * - [−1e+9, 1e+9] rarely uses exponential notation
   * - 0 always uses exponential notation
   */
  EXPONENTIAL_AT: number | [number, number];

  /**
   * Exponent value limits for overflow to Infinity and underflow to zero.
   * @default [-1e+9, 1e+9]
   * @example
   * - [-324, 308] matches JavaScript number behavior
   * - [-1e+9, 1e+9] allows for very large/small numbers
   * @throws {Error} If either value is zero
   */
  POWER_RANGE: [number, number];

  /**
   * Modulo mode used when calculating modulus.
   * Controls how the remainder is calculated.
   * @default 1 (ROUND_DOWN)
   * @values
   * - 0: ROUND_UP - Remainder has opposite sign to dividend
   * - 1: ROUND_DOWN - Remainder has same sign as dividend (JavaScript %)
   * - 3: ROUND_FLOOR - Remainder has same sign as divisor (Python %)
   * - 6: ROUND_HALF_EVEN - IEEE 754 remainder
   * - 9: EUCLID - Remainder is always positive
   */
  MODULO_MODE: number;

  /**
   * Maximum precision for power operations.
   * Limits significant digits in power operations.
   * @default 0 (unlimited)
   * @range 0 to 1e+9
   */
  POW_PRECISION: number;

  /**
   * Format configuration for decimal string representation.
   * Controls how numbers are formatted when using toFormat().
   */
  FORMAT: Partial<Format>;

  /**
   * Alphabet for base conversion.
   * Defines characters used for different bases.
   * Length determines maximum base value.
   * @default '0123456789abcdefghijklmnopqrstuvwxyz'
   * @constraints
   * - Minimum length: 2
   * - No whitespace
   * - No repeated characters
   * - Cannot contain '+', '-', or '.'
   */
  ALPHABET: string;

  /**
   * Enables strict validation and detailed error messages.
   * When true, performs additional checks and throws descriptive errors.
   * @default true
   */
  STRICT_MODE: boolean;

  /**
   * Default base (radix) for number representation.
   * Used when no base is specified in operations.
   * @default 10
   * @range 2 to ALPHABET.length
   */
  DEFAULT_BASE: number;
}

/**
 * Format configuration for decimal string representation.
 * Controls how numbers are formatted when using toFormat().
 * @example
 * ```typescript
 * const format: Format = {
 *   prefix: '$ ',
 *   decimalSeparator: '.',
 *   groupSeparator: ',',
 *   groupSize: 3,
 *   secondaryGroupSize: 0,
 *   fractionGroupSeparator: ' ',
 *   fractionGroupSize: 0,
 *   suffix: ' USD',
 *   signedZero: false
 * };
 * // Formats as: "$ 1,234,567.89 USD"
 * ```
 */
export interface Format {
  /**
   * String to prepend to the formatted number
   * @default ''
   * @example '$ ' for currency
   */
  prefix: string;

  /**
   * Character that separates the integer and fraction parts
   * @default '.'
   * @example ',' for European format
   */
  decimalSeparator: string;

  /**
   * Character that separates groups of digits in the integer part
   * @default ''
   * @example ' ' for European format
   */
  groupSeparator: string;

  /**
   * Primary grouping size of the integer part
   * @default 3
   * @example 3 for "1,234,567"
   */
  groupSize: number;

  /**
   * Secondary grouping size of the integer part
   * Used after the first group from right to left
   * @default 0 (disabled)
   * @example 2 for Indian numbering "1,23,45,678"
   */
  secondaryGroupSize: number;

  /**
   * Character that separates groups of digits in the fraction part
   * @default ' '
   */
  fractionGroupSeparator: string;

  /**
   * Grouping size of the fraction part
   * @default 0 (disabled)
   * @example 3 for "1.234 567 89"
   */
  fractionGroupSize: number;

  /**
   * String to append to the formatted number
   * @default ''
   * @example ' €' for currency
   */
  suffix: string;

  /**
   * Whether to show the minus sign for negative zero
   * @default false
   */
  signedZero: boolean;
}
