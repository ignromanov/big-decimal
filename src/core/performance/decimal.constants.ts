/**
 * Constants used across the BigDecimal implementation.
 * Centralizes all constant values to avoid circular dependencies.
 */
export const DECIMAL_CONSTANTS = {
  ZERO: { value: 0n, exp: 0, sign: 1 },
  NEGATIVE_ZERO: { value: 0n, exp: 0, sign: -1 },
  ONE: { value: 1n, exp: 0, sign: 1 },
  NEGATIVE_ONE: { value: 1n, exp: 0, sign: -1 },
  TEN: { value: 10n, exp: 0, sign: 1 },
  HUNDRED: { value: 100n, exp: 0, sign: 1 },
  THOUSAND: { value: 1000n, exp: 0, sign: 1 },
  MILLION: { value: 1000000n, exp: 0, sign: 1 },
  HALF: { value: 5n, exp: -1, sign: 1 },
  QUARTER: { value: 25n, exp: -2, sign: 1 },
  PI: { value: 314159265358979323846n, exp: -20, sign: 1 },
  E: { value: 271828182845904523536n, exp: -20, sign: 1 },
} as const;

/**
 * Gets all constant values as an array.
 * Used for cache initialization.
 */
export function getConstantValues(): BigDecimalTypes.DecimalInternal[] {
  return Object.values(DECIMAL_CONSTANTS);
}
