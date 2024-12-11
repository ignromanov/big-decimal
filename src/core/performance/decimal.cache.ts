import { getConstantValues } from "./decimal.constants";

/**
 * Cache implementation for BigDecimal instances to improve performance and memory usage.
 *
 * The cache stores BigDecimal instances using a string key format: "value|exp|sign".
 * It maintains a special handling for constant values that are never removed from cache.
 *
 * Features:
 * - Caches BigDecimal instances for reuse
 * - Preserves constant values in cache
 * - Provides methods for cache management
 *
 * @example
 * ```typescript
 * // Get a cached instance
 * const decimal = BigDecimalCache.get({ value: 123n, exp: 0, sign: 1 });
 *
 * // Clear non-constant values
 * BigDecimalCache.clear();
 *
 * // Get cache statistics
 * const size = BigDecimalCache.size();
 * const nonConstantSize = BigDecimalCache.nonConstantSize();
 * ```
 */
export class BigDecimalCache {
  /** Internal cache storage for BigDecimal instances */
  private static cache = new Map<string, BigDecimalTypes.IBigDecimal>();

  /** Set of keys representing constant values that should never be removed from cache */
  private static readonly constantKeys = new Set(
    getConstantValues().map((raw) => this.getKey(raw))
  );

  /** Cache for direct input values */
  private static inputCache = new Map<
    BigDecimalTypes.Input,
    BigDecimalTypes.IBigDecimal
  >();

  /** Factory function for creating BigDecimal instances */
  private static createInstance?: (
    params: BigDecimalTypes.DecimalInternal
  ) => BigDecimalTypes.IBigDecimal;

  /**
   * Sets the factory function for creating BigDecimal instances
   * @param factory - Factory function that creates BigDecimal instances
   */
  static setFactory(
    factory: (
      params: BigDecimalTypes.DecimalInternal
    ) => BigDecimalTypes.IBigDecimal
  ): void {
    this.createInstance = factory;
  }

  /**
   * Attempts to retrieve a BigDecimal instance from the input cache.
   * @param input - The raw input value
   * @returns Cached BigDecimal instance or undefined if not found
   */
  static getFromInputCache(
    input: BigDecimalTypes.Input
  ): BigDecimalTypes.IBigDecimal | undefined {
    return this.inputCache.get(input);
  }

  /**
   * Stores a BigDecimal instance in the input cache.
   * @param input - The raw input value
   * @param decimal - The BigDecimal instance
   */
  static setToInputCache(
    input: BigDecimalTypes.Input,
    decimal: BigDecimalTypes.IBigDecimal
  ): void {
    this.inputCache.set(input, decimal);
  }

  /**
   * Retrieves a BigDecimal instance from cache or creates a new one if not found.
   *
   * @param params - Raw decimal parameters
   * @returns Cached or new BigDecimal instance
   */
  static get(
    params: BigDecimalTypes.DecimalInternal
  ): BigDecimalTypes.IBigDecimal {
    const key = this.getKey(params);
    if (!this.cache.has(key)) {
      if (!this.createInstance) {
        throw new Error("BigDecimal factory not set. Call setFactory first.");
      }
      this.cache.set(key, this.createInstance(params));
    }
    return this.cache.get(key)!;
  }

  /**
   * Generates a cache key from raw decimal parameters.
   * Format: "value|exp|sign"
   *
   * @param value - Numerical value without sign
   * @param exp - Exponent for decimal point position
   * @param sign - Sign (1 for positive, -1 for negative)
   * @returns Cache key string
   */
  private static getKey({
    value,
    exp,
    sign,
  }: BigDecimalTypes.DecimalInternal): string {
    return `${value}|${exp}|${sign}`;
  }

  /**
   * Checks if a given key represents a constant value.
   *
   * @param key - Cache key to check
   * @returns True if key represents a constant value
   */
  private static isConstantKey(key: string): boolean {
    return this.constantKeys.has(key);
  }

  /**
   * Clears all non-constant values from cache.
   * Constant values are preserved and restored after clearing.
   */
  static clear(): void {
    const constants = new Map(
      Array.from(this.cache.entries()).filter(([key]) =>
        this.isConstantKey(key)
      )
    );
    this.cache.clear();
    this.inputCache.clear();
    constants.forEach((value, key) => this.cache.set(key, value));
  }

  /**
   * Returns the number of non-constant values in cache.
   *
   * @returns Number of non-constant cached values
   */
  static nonConstantSize(): number {
    return (
      Array.from(this.cache.keys()).filter((key) => !this.isConstantKey(key))
        .length + this.inputCache.size
    );
  }

  /**
   * Returns the total number of values in cache.
   *
   * @returns Total number of cached values
   */
  static size(): number {
    return this.cache.size + this.inputCache.size;
  }
}
