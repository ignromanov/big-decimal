import type { BigDecimalTypes } from "@/core/types";

/**
 * Abstract base class for arbitrary-precision decimal arithmetic.
 * Provides a foundation for different implementations:
 * - {@link RegularBigDecimal} - Regular decimal numbers
 * - {@link NaNBigDecimal} - Not a Number representation
 * - {@link InfiniteBigDecimal} - Positive and Negative Infinity
 *
 * @remarks
 * This class defines the core interface that all BigDecimal implementations must follow.
 * It ensures consistent behavior across different types of decimal numbers.
 */
export abstract class AbstractBigDecimal {
  /** Sign of the number (1 for positive, -1 for negative, null for NaN) */
  protected abstract _sign: 1 | -1 | null;

  /** The numerical value stored as a bigint (without sign and exponent) or null for special values */
  protected abstract _value: bigint | null;

  /** Exponent of the number */
  protected abstract _exp: number;

  /** Gets the sign of the number */
  abstract get sign(): 1 | -1 | null;

  /** Gets the numerical value */
  abstract get value(): bigint | null;

  /** Gets the exponent */
  abstract get exp(): number;

  /**
   * Type guard to check if value is NaN
   * @returns True if this is NaNBigDecimal
   */
  abstract isNaN(): this is BigDecimalTypes.INaNDecimal;

  /**
   * Type guard to check if value is Infinite
   * @returns True if this is InfiniteBigDecimal
   */
  abstract isInfinite(): this is BigDecimalTypes.IInfinityDecimal;

  /**
   * Type guard to check if value is Finite
   * @returns True if this is RegularBigDecimal
   */
  abstract isFinite(): this is BigDecimalTypes.IRegularDecimal;

  /**
   * Converts value to number
   * @returns Number representation
   */
  abstract valueOf(): number;

  /**
   * Converts value to string
   * @returns String representation
   */
  abstract toString(): string;
}
