import type { BigDecimalTypes } from "@/core/base";
import type { BigDecimalConfig } from "@/core/config";
import type { AbstractBigDecimal } from "../base/abstract-decimal.class";

/**
 * Namespace containing factory-related types and interfaces
 */
export namespace BigDecimalFactoryTypes {
  /**
   * Interface for the BigDecimal factory function and its static members.
   * Mirrors the structure of EnhancedBigDecimal's static methods and properties
   * while adding module-specific functionality.
   */
  export interface FactoryFunction<
    T extends BigDecimalConfig.ModulesConfig = BigDecimalConfig.ModulesConfig
  > {
    /**
     * Creates a BigDecimal instance with configured modules
     * @param value - Input value to convert to BigDecimal
     * @param base - Base for decimal places (default from configuration)
     */
    (
      value: BigDecimalTypes.Value,
      base?: BigDecimalTypes.Base
    ): BigDecimalTypes.BigDecimal<T>;

    /**
     * Creates a BigDecimal instance (alias for the main function)
     * @param value - Input value to convert to BigDecimal
     * @param base - Base for decimal places (default from configuration)
     */
    from(
      value: BigDecimalTypes.Value,
      base?: BigDecimalTypes.Base
    ): BigDecimalTypes.BigDecimal<T>;

    /**
     * Creates a BigDecimal instance (short alias for the main function)
     * @param value - Input value to convert to BigDecimal
     * @param base - Base for decimal places (default from configuration)
     */
    fr(
      value: BigDecimalTypes.Value,
      base?: BigDecimalTypes.Base
    ): BigDecimalTypes.BigDecimal<T>;

    /**
     * Checks if a value is valid for creating a BigDecimal instance
     * @param value - Value to check
     * @returns True if value can be converted to BigDecimal
     */
    isValid(value: unknown): boolean;

    /**
     * Special value representing Not a Number
     * @readonly
     */
    readonly NaN: BigDecimalTypes.BigDecimal<T>;

    /**
     * Special value representing positive infinity
     * @readonly
     */
    readonly POSITIVE_INFINITY: BigDecimalTypes.BigDecimal<T>;

    /**
     * Special value representing negative infinity
     * @readonly
     */
    readonly NEGATIVE_INFINITY: BigDecimalTypes.BigDecimal<T>;

    /**
     * Special value representing zero
     * @readonly
     */
    readonly zero: BigDecimalTypes.BigDecimal<T>;
  }

  /**
   * Type for the factory configuration result
   * Represents the complete factory instance with all its methods and properties
   */
  export type Factory<T extends BigDecimalConfig.ModulesConfig> =
    FactoryFunction<T>;
}
