export namespace BigDecimalConfig {
  export interface Format {
    prefix: string;
    decimalSeparator: string;
    groupSeparator: string;
    groupSize: number;
    secondaryGroupSize: number;
    fractionGroupSeparator: string;
    fractionGroupSize: number;
    suffix: string;
    signedZero: boolean;
  }

  export interface Preferences {
    /**
     * Maximum number of decimal places for operations involving division
     * @default 20
     */
    DECIMAL_PLACES: number;

    /**
     * Rounding mode used for operations
     * @default ROUND_HALF_UP
     */
    ROUNDING_MODE: number;

    /**
     * Exponent value(s) at which toString returns exponential notation
     * @default [-7, 20]
     */
    EXPONENTIAL_AT: number | [number, number];

    /**
     * Exponent value(s) for overflow to Infinity and underflow to zero
     * @default [-1e9, 1e9]
     */
    RANGE: [number, number] | number;

    /**
     * Modulo mode used when calculating modulus
     * @default ROUND_DOWN
     */
    MODULO_MODE: number;

    /**
     * Maximum precision for power operations
     * @default 0 (unlimited)
     */
    POW_PRECISION: number;

    /**
     * Format configuration for toFormat method
     */
    FORMAT: Partial<Format>;

    /**
     * Alphabet for base conversion
     * @default '0123456789abcdefghijklmnopqrstuvwxyz'
     */
    ALPHABET: string;

    /**
     * Debug mode
     * @default true
     */
    DEBUG: boolean;

    /**
     * Default base (radix) for number representation
     * @default 10
     */
    DEFAULT_BASE: number;
  }

  type ModuleNames = "arithmetic" | "formatting" | "comparison";

  export type ModulesConfig = {
    [key in ModuleNames]?: boolean;
  };

  export interface Config<T extends ModulesConfig>
    extends Partial<Preferences> {
    modules?: T;
  }
}
