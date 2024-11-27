/**
 * Singleton class for managing global BigDecimal configuration.
 * Provides centralized access to configuration preferences and format settings.
 *
 * Features:
 * - Global configuration management
 * - Type-safe configuration updates
 * - Immutable configuration access
 * - Default configuration values
 *
 * @example
 * ```typescript
 * // Get configuration instance
 * const config = BigDecimalConfiguration.getInstance();
 *
 * // Update configuration
 * config.updateConfig({
 *   DECIMAL_PLACES: 10,
 *   FORMAT: {
 *     decimalSeparator: ","
 *   }
 * });
 *
 * // Get current configuration
 * const currentConfig = config.getConfig();
 *
 * // Get current configuration directly
 * const currentConfig = BigDecimalConfiguration.get();
 * ```
 */
export class BigDecimalConfiguration {
  private static instance: BigDecimalConfiguration;
  private config: BigDecimalTypes.Config;

  private constructor() {
    this.config = {
      DECIMAL_PLACES: 20,
      ROUNDING_MODE: 4, // ROUND_HALF_UP
      EXPONENTIAL_AT: [-7, 20],
      POWER_RANGE: [-1e9, 1e9],
      MODULO_MODE: 1, // ROUND_DOWN
      POW_PRECISION: 0,
      FORMAT: {
        decimalSeparator: ".",
        groupSeparator: "",
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: " ",
        fractionGroupSize: 0,
        prefix: "",
        suffix: "",
        signedZero: false,
      },
      ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
      STRICT_MODE: true,
      DEFAULT_BASE: 10,
    };
  }

  /**
   * Gets the singleton instance of the configuration.
   * Creates a new instance with default values if none exists.
   *
   * @returns The singleton configuration instance
   */
  static getInstance(): BigDecimalConfiguration {
    if (!BigDecimalConfiguration.instance) {
      BigDecimalConfiguration.instance = new BigDecimalConfiguration();
    }
    return BigDecimalConfiguration.instance;
  }

  /**
   * Updates configuration with new values.
   * Merges the provided partial configuration with existing values.
   *
   * @param config - Partial configuration object with values to update
   */
  updateConfig(config: Partial<BigDecimalTypes.Config>): void {
    if (config.FORMAT) {
      config.FORMAT = { ...this.config.FORMAT, ...config.FORMAT };
    }
    Object.assign(this.config, config);
  }

  /**
   * Gets current configuration.
   * Returns a frozen copy to prevent modifications.
   *
   * @returns Immutable copy of current configuration
   */
  getConfig(): Readonly<BigDecimalTypes.Config> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Gets current configuration directly.
   * Returns a frozen copy to prevent modifications.
   *
   * @returns Immutable copy of current configuration
   */
  static get(): Readonly<BigDecimalTypes.Config> {
    return this.getInstance().getConfig();
  }
}
