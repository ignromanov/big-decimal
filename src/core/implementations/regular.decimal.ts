import { AbstractDecimal } from "@/core/base";

import { arithmeticModule } from "@/core/modules/arithmetic/operations.module";
import { formattingModule } from "@/core/modules/formatting/operations.module";
import { comparisonModule } from "@/core/modules/comparison/operations.module";
/**
 * Main class for arbitrary-precision decimal arithmetic.
 * Represents regular (finite) decimal numbers with arbitrary precision.
 *
 * @remarks
 * This class provides core decimal arithmetic functionality with:
 * - Arbitrary precision arithmetic
 * - Exact decimal representation
 * - Configurable rounding modes
 * - Special value handling
 *
 * @example
 * ```typescript
 * const a = BigDecimal.fromRawValues(123n, -2, 1); // 1.23
 * const b = BigDecimal.fromRawValues(456n, -1, -1); // -45.6
 * console.log(a.add(b).toString()); // "-44.37"
 * ```
 */
export class RegularDecimal
  extends AbstractDecimal
  implements BigDecimalTypes.IRegularDecimal
{
  protected _value: bigint = 0n;
  protected _sign: 1 | -1 = 1;
  protected _exp: number = 0;

  /**
   * Private constructor to enforce factory pattern
   * @internal
   */
  private constructor({ value, exp, sign }: BigDecimalTypes.DecimalInternal) {
    super();
    this._value = value;
    this._exp = exp;
    this._sign = sign;
    Object.assign(this, arithmeticModule);
    Object.assign(this, formattingModule);
    Object.assign(this, comparisonModule);
  }

  /**
   * Creates a BigDecimal from raw components
   * @param value - The numerical value as bigint (without sign)
   * @param exp - The exponent for decimal point position
   * @param sign - The sign (1 for positive, -1 for negative)
   * @returns New BigDecimal instance
   *
   * @example
   * ```typescript
   * const num = BigDecimal.fromRawValues(1234n, -2, 1); // 12.34
   * ```
   */
  public static fromRaw(
    value: BigDecimalTypes.Value,
    exp: BigDecimalTypes.Exp,
    sign: BigDecimalTypes.Sign
  ): BigDecimalTypes.IRegularDecimal {
    return new RegularDecimal({ value, exp, sign });
  }

  /**
   * Gets the numerical value
   * @returns The coefficient as bigint
   */
  get value(): bigint {
    return this._value;
  }

  /**
   * Gets the sign
   * @returns 1 for positive, -1 for negative
   */
  get sign(): 1 | -1 {
    return this._sign;
  }

  /**
   * Gets the exponent
   * @returns The decimal exponent
   */
  get exp(): number {
    return this._exp;
  }

  /**
   * Checks if the value is zero
   * @returns True if the value is zero
   */
  isZero(): boolean {
    return this.value === 0n;
  }

  /**
   * Checks if the value is positive
   * @returns True if the value is positive
   */
  isPositive(): boolean {
    return this.sign === 1;
  }

  /**
   * Checks if the value is negative
   * @returns True if the value is negative
   */
  isNegative(): boolean {
    return this.sign === -1;
  }

  /**
   * Type guard to check if value is a regular decimal
   * @returns Always true for BigDecimal instances
   */
  isRegular(): this is BigDecimalTypes.IRegularDecimal {
    return true;
  }

  /**
   * Type guard to check if value is NaN
   * @returns Always false for BigDecimal instances
   */
  isNaN(): this is BigDecimalTypes.INaNDecimal {
    return false;
  }

  /**
   * Type guard to check if value is Infinite
   * @returns Always false for BigDecimal instances
   */
  isInfinite(): this is BigDecimalTypes.IInfinityDecimal {
    return false;
  }

  /**
   * Type guard to check if value is Finite
   * @returns Always true for BigDecimal instances
   */
  isFinite(): this is BigDecimalTypes.IRegularDecimal {
    return true;
  }

  /**
   * Converts to JavaScript number
   * @returns Number representation
   * @throws {RangeError} If value cannot be represented as a number
   */
  valueOf(): number {
    return formattingModule.toNumber.call(this);
  }

  /**
   * Converts to string representation
   * @returns String representation of the decimal
   */
  toString(): string {
    return formattingModule.toString.call(this);
  }

  /**
   * Converts value to primitive type
   * @param hint - Type hint ("string" or "number")
   * @returns String or number representation
   * @internal
   */
  [Symbol.toPrimitive](hint: "string" | "number" | "default"): string | number {
    return hint === "string" ? this.toString() : this.valueOf();
  }

  // Arithmetic operations
  add!: BigDecimalTypes.IArithmeticOperations["add"];
  subtract!: BigDecimalTypes.IArithmeticOperations["subtract"];
  multiply!: BigDecimalTypes.IArithmeticOperations["multiply"];
  divide!: BigDecimalTypes.IArithmeticOperations["divide"];
  negate!: BigDecimalTypes.IArithmeticOperations["negate"];
  abs!: BigDecimalTypes.IArithmeticOperations["abs"];
  sqrt!: BigDecimalTypes.IArithmeticOperations["sqrt"];
  round!: BigDecimalTypes.IArithmeticOperations["round"];
  precision!: BigDecimalTypes.IArithmeticOperations["precision"];
  power!: BigDecimalTypes.IArithmeticOperations["power"];
  modulo!: BigDecimalTypes.IArithmeticOperations["modulo"];

  // Arithmetic aliases
  plus!: BigDecimalTypes.IArithmeticOperations["plus"];
  minus!: BigDecimalTypes.IArithmeticOperations["minus"];
  times!: BigDecimalTypes.IArithmeticOperations["times"];
  div!: BigDecimalTypes.IArithmeticOperations["div"];
  pow!: BigDecimalTypes.IArithmeticOperations["pow"];
  mod!: BigDecimalTypes.IArithmeticOperations["mod"];

  // Formatting operations
  MAX_DECIMALS!: number;
  toNumber!: BigDecimalTypes.IFormattingOperations["toNumber"];
  toFixed!: BigDecimalTypes.IFormattingOperations["toFixed"];
  toExponential!: BigDecimalTypes.IFormattingOperations["toExponential"];
  toEngineering!: BigDecimalTypes.IFormattingOperations["toEngineering"];

  // Comparison operations
  compareTo!: BigDecimalTypes.IComparisonOperations["compareTo"];
  equals!: BigDecimalTypes.IComparisonOperations["equals"];
  lessThan!: BigDecimalTypes.IComparisonOperations["lessThan"];
  lessThanOrEqual!: BigDecimalTypes.IComparisonOperations["lessThanOrEqual"];
  greaterThan!: BigDecimalTypes.IComparisonOperations["greaterThan"];
  greaterThanOrEqual!: BigDecimalTypes.IComparisonOperations["greaterThanOrEqual"];
  max!: BigDecimalTypes.IComparisonOperations["max"];
  min!: BigDecimalTypes.IComparisonOperations["min"];

  // Comparison aliases
  eq!: BigDecimalTypes.IComparisonOperations["eq"];
  lt!: BigDecimalTypes.IComparisonOperations["lt"];
  lte!: BigDecimalTypes.IComparisonOperations["lte"];
  gt!: BigDecimalTypes.IComparisonOperations["gt"];
  gte!: BigDecimalTypes.IComparisonOperations["gte"];
}
