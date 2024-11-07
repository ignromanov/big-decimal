import { BigDecimalErrors } from "@/errors";
import { RoundingMode } from "./rounding-modes";
import type { BigDecimalConfig } from "./config.types";

export class BigDecimalConfiguration {
  private static instance: BigDecimalConfiguration;

  private readonly DEFAULT_CONFIG: Readonly<BigDecimalConfig.Config> = {
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: RoundingMode.ROUND_HALF_UP,
    EXPONENTIAL_AT: [-7, 20],
    RANGE: [-1e9, 1e9],
    MODULO_MODE: RoundingMode.ROUND_DOWN,
    POW_PRECISION: 0,
    FORMAT: {
      prefix: "",
      decimalSeparator: ".",
      groupSeparator: ",",
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: " ",
      fractionGroupSize: 0,
      suffix: "",
      signedZero: false,
    },
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
    DEBUG: true,
    DEFAULT_BASE: 10,
  } as const;

  private currentConfig: BigDecimalConfig.Config;

  private constructor() {
    this.currentConfig = { ...this.DEFAULT_CONFIG };
  }

  static getInstance(): BigDecimalConfiguration {
    if (!BigDecimalConfiguration.instance) {
      BigDecimalConfiguration.instance = new BigDecimalConfiguration();
    }
    return BigDecimalConfiguration.instance;
  }

  /**
   * Updates configuration settings
   * @throws {BigDecimalError} If config validation fails
   */
  config(config: Partial<BigDecimalConfig.Config>): void {
    this.validateConfig(config);
    this.currentConfig = {
      ...this.currentConfig,
      ...config,
      FORMAT: config.FORMAT
        ? { ...this.currentConfig.FORMAT, ...config.FORMAT }
        : this.currentConfig.FORMAT,
    };
  }

  /**
   * Resets configuration to default values
   */
  reset(): void {
    this.currentConfig = { ...this.DEFAULT_CONFIG };
  }

  /**
   * Gets current configuration
   */
  getConfig(): Readonly<BigDecimalConfig.Config> {
    return { ...this.currentConfig };
  }

  private validateConfig(config: Partial<BigDecimalConfig.Config>): void {
    Object.entries(config).forEach(([key, value]) => {
      switch (key) {
        case "DECIMAL_PLACES":
          this.validateDecimalPlaces(value as number);
          break;
        case "RANGE":
          this.validateRange(value as [number, number]);
          break;
        case "EXPONENTIAL_AT":
          this.validateExponentialAt(value as number | [number, number]);
          break;
        case "POW_PRECISION":
          this.validatePowPrecision(value as number);
          break;
        case "FORMAT":
          this.validateFormat(value as Partial<BigDecimalConfig.Format>);
          break;
        case "ALPHABET":
          this.validateAlphabet(value as string);
          break;
        case "DEBUG":
          this.validateDebug(value as boolean);
          break;
      }
    });
  }

  private validateDecimalPlaces(value: number): void {
    if (!Number.isInteger(value) || value < 0 || value > 1e9) {
      throw BigDecimalErrors.invalidConfig(
        "DECIMAL_PLACES must be an integer between 0 and 1e9",
        { received: value }
      );
    }
  }

  private validateRange(range: [number, number]): void {
    const [min, max] = range;
    if (!Array.isArray(range) || range.length !== 2) {
      throw BigDecimalErrors.invalidConfig(
        "RANGE must be an array of two numbers",
        {
          received: range,
        }
      );
    }
    if (!Number.isInteger(min) || !Number.isInteger(max) || min >= max) {
      throw BigDecimalErrors.invalidConfig(
        "RANGE must be [min, max] where min and max are integers and min < max",
        { received: range }
      );
    }
  }

  private validateExponentialAt(value: number | [number, number]): void {
    if (Array.isArray(value)) {
      const [negative, positive] = value;
      if (
        value.length !== 2 ||
        !Number.isInteger(negative) ||
        !Number.isInteger(positive)
      ) {
        throw BigDecimalErrors.invalidConfig(
          "EXPONENTIAL_AT must be an integer or [negative, positive] integers",
          { received: value }
        );
      }
    } else if (!Number.isInteger(value)) {
      throw BigDecimalErrors.invalidConfig(
        "EXPONENTIAL_AT must be an integer or [negative, positive] integers",
        { received: value }
      );
    }
  }

  private validatePowPrecision(value: number): void {
    if (!Number.isInteger(value) || value < 0) {
      throw BigDecimalErrors.invalidConfig(
        "POW_PRECISION must be a non-negative integer",
        { received: value }
      );
    }
  }

  private validateFormat(format: Partial<BigDecimalConfig.Format>): void {
    if (
      format.groupSize !== undefined &&
      (!Number.isInteger(format.groupSize) || format.groupSize < 0)
    ) {
      throw BigDecimalErrors.invalidConfig(
        "FORMAT.groupSize must be a non-negative integer",
        { received: format.groupSize }
      );
    }
    if (
      format.fractionGroupSize !== undefined &&
      (!Number.isInteger(format.fractionGroupSize) ||
        format.fractionGroupSize < 0)
    ) {
      throw BigDecimalErrors.invalidConfig(
        "FORMAT.fractionGroupSize must be a non-negative integer",
        { received: format.fractionGroupSize }
      );
    }
    if (
      format.signedZero !== undefined &&
      typeof format.signedZero !== "boolean"
    ) {
      throw BigDecimalErrors.invalidConfig(
        "FORMAT.signedZero must be a boolean",
        { received: format.signedZero }
      );
    }
  }

  private validateAlphabet(value: string): void {
    if (typeof value !== "string" || value.length < 2) {
      throw BigDecimalErrors.invalidConfig(
        "ALPHABET must be a string with at least 2 characters",
        { received: value }
      );
    }
    // Check for unique characters
    if (new Set(value).size !== value.length) {
      throw BigDecimalErrors.invalidConfig(
        "ALPHABET must contain unique characters",
        { received: value }
      );
    }
  }

  private validateDebug(value: boolean): void {
    if (typeof value !== "boolean") {
      throw BigDecimalErrors.invalidConfig("DEBUG must be a boolean", {
        received: value,
      });
    }
  }
}
