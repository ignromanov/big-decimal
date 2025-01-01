import { ArithmeticModule } from "@/old-src/modules/arithmetic/arithmetic.module";
import { BigDecimalTypes } from "../base/decimal-types.namespace";
import { BigDecimalConfig } from "../config/config-types.namespace";
import { EnhancedBigDecimal } from "../implementations/enhanced-decimal.class";
import { BigDecimalFactoryTypes } from "./factory.types";

export class BigDecimalFactory {
  /**
   * Configures and returns a BigDecimal factory with the specified modules
   * @param config - Configuration including modules and preferences
   * @returns A function that creates BigDecimal instances with configured modules
   */
  static config<T extends BigDecimalConfig.ModulesConfig>(
    config: BigDecimalConfig.Config<T>
  ): BigDecimalFactoryTypes.Factory<T> {
    const { modules, ...preferences } = config;
    EnhancedBigDecimal.config(preferences);

    /**
     * Creates a BigDecimal instance with configured modules
     * @param value - Input value to convert to BigDecimal
     * @param base - Base for decimal places (default from configuration)
     * @returns BigDecimal instance with configured modules
     */
    function decimalCreator(
      value: BigDecimalTypes.Value,
      base?: BigDecimalTypes.Base
    ): BigDecimalTypes.BigDecimal<T> {
      const decimal = EnhancedBigDecimal.create(value, base);

      // Use proper type casting instead of object spread
      const result = decimal as unknown as BigDecimalTypes.BigDecimal<T>;

      if (modules?.arithmetic) {
        const arithmeticModule = new ArithmeticModule(decimal);
        Object.defineProperties(
          decimal,
          Object.getOwnPropertyDescriptors(arithmeticModule)
        );
      }

      if (modules?.formatting) {
        // Future formatting module implementation
      }

      if (modules?.comparison) {
        // Future comparison module implementation
      }

      return result;
    }

    // Static methods
    decimalCreator.from = decimalCreator;
    decimalCreator.fr = decimalCreator;

    /**
     * Checks if a value is valid for creating a BigDecimal instance
     * @param value - Value to check
     * @returns True if value can be converted to BigDecimal
     */
    decimalCreator.isValid = EnhancedBigDecimal.isValid;

    // Special values
    decimalCreator.NaN =
      EnhancedBigDecimal.NaN as unknown as BigDecimalTypes.BigDecimal<T>;
    decimalCreator.POSITIVE_INFINITY =
      EnhancedBigDecimal.POSITIVE_INFINITY as unknown as BigDecimalTypes.BigDecimal<T>;
    decimalCreator.NEGATIVE_INFINITY =
      EnhancedBigDecimal.NEGATIVE_INFINITY as unknown as BigDecimalTypes.BigDecimal<T>;
    decimalCreator.zero =
      EnhancedBigDecimal.zero as unknown as BigDecimalTypes.BigDecimal<T>;

    return decimalCreator;
  }
}
