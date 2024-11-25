/**
 * Abstract base class for arbitrary-precision decimal arithmetic.
 * Provides a foundation for different implementations:
 * - {@link Decimal} - Regular decimal numbers
 * - {@link NaNDecimal} - Not a Number representation
 * - {@link InfinityDecimal} - Positive and Negative Infinity
 *
 * @remarks
 * This class defines the core interface that all Decimal implementations must follow.
 * It ensures consistent behavior across different types of decimal numbers.
 *
 * @example
 * ```typescript
 * const decimal = new Decimal(123n, 0, 1);
 * if (decimal.isRegular()) {
 *   console.log(decimal.value); // 123n
 * }
 * ```
 */
export abstract class AbstractDecimal
  implements BigDecimalTypes.IAbstractDecimal
{
  /** Sign of the number (1 for positive, -1 for negative, null for special values) */
  protected abstract _sign: 1 | -1 | null;

  /** The numerical value stored as a bigint (null for special values) */
  protected abstract _value: bigint | null;

  /** Exponent of the number */
  protected abstract _exp: number;

  /** Gets the sign of the number */
  abstract get sign(): 1 | -1 | null;

  /** Gets the numerical value */
  abstract get value(): bigint | null;

  /** Gets the exponent */
  abstract get exp(): number;

  /** Checks if the value is zero */
  abstract isZero(): boolean;

  /** Checks if the value is positive */
  abstract isPositive(): boolean;

  /** Checks if the value is negative */
  abstract isNegative(): boolean;

  /**
   * Type guard to check if value is a regular decimal
   * @returns True if this is a regular decimal
   */
  abstract isRegular(): this is BigDecimalTypes.IRegularDecimal;

  /**
   * Type guard to check if value is NaN
   * @returns True if this is NaN
   */
  abstract isNaN(): this is BigDecimalTypes.INaNDecimal;

  /**
   * Type guard to check if value is Infinite
   * @returns True if this is Infinity
   */
  abstract isInfinite(): this is BigDecimalTypes.IInfinityDecimal;

  /**
   * Type guard to check if value is Finite
   * @returns True if this is a regular decimal
   */
  abstract isFinite(): this is BigDecimalTypes.IRegularDecimal;

  /**
   * Converts value to primitive number
   * @returns Number representation
   * @throws {RangeError} If value cannot be represented as a number
   */
  abstract valueOf(): number;

  /**
   * Converts value to string
   * @returns String representation
   */
  abstract toString(): string;

  /**
   * Converts value to primitive type
   * @param hint - Type hint ("string" or "number")
   * @returns String or number representation
   * @internal
   */
  abstract [Symbol.toPrimitive](
    hint: "string" | "number" | "default"
  ): string | number;

  // Arithmetic operations
  abstract add: BigDecimalTypes.IArithmeticOperations["add"];
  abstract subtract: BigDecimalTypes.IArithmeticOperations["subtract"];
  abstract multiply: BigDecimalTypes.IArithmeticOperations["multiply"];
  abstract divide: BigDecimalTypes.IArithmeticOperations["divide"];
  abstract negate: BigDecimalTypes.IArithmeticOperations["negate"];
  abstract abs: BigDecimalTypes.IArithmeticOperations["abs"];
  abstract sqrt: BigDecimalTypes.IArithmeticOperations["sqrt"];
  abstract round: BigDecimalTypes.IArithmeticOperations["round"];
  abstract precision: BigDecimalTypes.IArithmeticOperations["precision"];
  abstract power: BigDecimalTypes.IArithmeticOperations["power"];
  abstract modulo: BigDecimalTypes.IArithmeticOperations["modulo"];

  // Arithmetic aliases
  abstract plus: BigDecimalTypes.IArithmeticOperations["plus"];
  abstract minus: BigDecimalTypes.IArithmeticOperations["minus"];
  abstract times: BigDecimalTypes.IArithmeticOperations["times"];
  abstract div: BigDecimalTypes.IArithmeticOperations["div"];
  abstract pow: BigDecimalTypes.IArithmeticOperations["pow"];
  abstract mod: BigDecimalTypes.IArithmeticOperations["mod"];

  // Formatting operations
  abstract MAX_DECIMALS: number;
  abstract toNumber: BigDecimalTypes.IFormattingOperations["toNumber"];
  abstract toFixed: BigDecimalTypes.IFormattingOperations["toFixed"];
  abstract toExponential: BigDecimalTypes.IFormattingOperations["toExponential"];
  abstract toEngineering: BigDecimalTypes.IFormattingOperations["toEngineering"];

  // Comparison operations
  abstract compareTo: BigDecimalTypes.IComparisonOperations["compareTo"];
  abstract equals: BigDecimalTypes.IComparisonOperations["equals"];
  abstract lessThan: BigDecimalTypes.IComparisonOperations["lessThan"];
  abstract lessThanOrEqual: BigDecimalTypes.IComparisonOperations["lessThanOrEqual"];
  abstract greaterThan: BigDecimalTypes.IComparisonOperations["greaterThan"];
  abstract greaterThanOrEqual: BigDecimalTypes.IComparisonOperations["greaterThanOrEqual"];
  abstract max: BigDecimalTypes.IComparisonOperations["max"];
  abstract min: BigDecimalTypes.IComparisonOperations["min"];

  // Comparison aliases
  abstract eq: BigDecimalTypes.IComparisonOperations["eq"];
  abstract lt: BigDecimalTypes.IComparisonOperations["lt"];
  abstract lte: BigDecimalTypes.IComparisonOperations["lte"];
  abstract gt: BigDecimalTypes.IComparisonOperations["gt"];
  abstract gte: BigDecimalTypes.IComparisonOperations["gte"];
}
