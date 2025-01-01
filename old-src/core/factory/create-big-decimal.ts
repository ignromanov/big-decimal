import { BigDecimalFactory } from "@/core/factory";
import type { BigDecimalConfig } from "../config/config-types.namespace";

/**
 * Creates a configured BigDecimal factory with the specified modules
 * @param config - Configuration including modules and preferences
 * @returns A function that creates BigDecimal instances with configured modules
 *
 * @example
 * const BD = createBigDecimalConfig({ modules: { arithmetic: true }});
 * const value1 = BD('123.45');
 * const value2 = BD.from('123.45');
 * const isValid = BD.isValid('123.45');
 * const zero = BD.zero;
 */
export const createBigDecimalConfig = <
  T extends BigDecimalConfig.ModulesConfig
>(
  config: BigDecimalConfig.Config<T>
) => {
  return BigDecimalFactory.config<T>(config);
};
