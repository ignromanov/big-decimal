import { SpecialDecimal } from "@/core/base";

import { BigDecimalFlyweight } from "@/core/performance";
import { BigDecimalFactory } from "@/core/factory";

/**
 * Represents positive or negative Infinity in decimal arithmetic.
 * Implements singleton pattern to ensure only two instances exist:
 * one for positive infinity and one for negative infinity.
 *
 * @remarks
 * InfinityDecimal is used to represent values that exceed the representable range
 * or result from operations like division by zero.
 *
 * @example
 * ```typescript
 * const positiveInfinity = InfinityDecimal.POSITIVE;
 * const negativeInfinity = InfinityDecimal.NEGATIVE;
 *
 * console.log(positiveInfinity.toString()); // "Infinity"
 * console.log(negativeInfinity.toString()); // "-Infinity"
 *
 * // Type guards
 * if (positiveInfinity.isInfinite()) {
 *   console.log("This is Infinity");
 * }
 * ```
 */
export class InfinityDecimal
  extends SpecialDecimal
  implements BigDecimalTypes.IInfinityDecimal
{
  /** Singleton instances */
  private static _positiveInstance: BigDecimalTypes.IInfinityDecimal | null =
    null;
  private static _negativeInstance: BigDecimalTypes.IInfinityDecimal | null =
    null;

  /**
   * Private constructor to prevent direct instantiation.
   * Use InfinityDecimal.POSITIVE or InfinityDecimal.NEGATIVE to get instances.
   */
  private constructor(protected _sign: 1 | -1) {
    super();
  }

  /**
   * Gets the positive infinity singleton instance.
   * Creates the instance if it doesn't exist.
   */
  public static get POSITIVE(): BigDecimalTypes.IInfinityDecimal {
    if (!InfinityDecimal._positiveInstance) {
      InfinityDecimal._positiveInstance = new InfinityDecimal(1);
    }
    return InfinityDecimal._positiveInstance;
  }

  /**
   * Gets the negative infinity singleton instance.
   * Creates the instance if it doesn't exist.
   */
  public static get NEGATIVE(): BigDecimalTypes.IInfinityDecimal {
    if (!InfinityDecimal._negativeInstance) {
      InfinityDecimal._negativeInstance = new InfinityDecimal(-1);
    }
    return InfinityDecimal._negativeInstance;
  }

  /** @returns Sign of infinity (1 for positive, -1 for negative) */
  get sign(): 1 | -1 {
    return this._sign;
  }

  /**
   * Checks if the value is zero
   * @returns Always false as this represents Infinity
   */
  isZero(): boolean {
    return false;
  }

  /**
   * Checks if the value is positive
   * @returns Always false as this represents Infinity
   */
  isPositive(): boolean {
    return this.sign === 1;
  }

  /**
   * Checks if the value is negative
   * @returns Always true as this represents Infinity
   */
  isNegative(): boolean {
    return this.sign === -1;
  }

  /**
   * @returns Always false as this represents Infinity
   */
  isNaN(): this is BigDecimalTypes.INaNDecimal {
    return false;
  }

  /**
   * @returns Always true as this represents Infinity
   */
  isInfinite(): this is BigDecimalTypes.IInfinityDecimal {
    return true;
  }

  /**
   * @returns JavaScript's Infinity or -Infinity
   */
  valueOf(): number {
    return this._sign === 1 ? Infinity : -Infinity;
  }

  /**
   * @returns "Infinity" or "-Infinity"
   */
  toString(): string {
    return this._sign === 1 ? "Infinity" : "-Infinity";
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
  add = () => this;
  subtract = () => this;
  multiply = (input: BigDecimalTypes.Input) => {
    const other = BigDecimalFactory.create(input);
    if (other.isZero()) return BigDecimalFlyweight.NaN;
    return this;
  };
  divide = () => this;
  negate = () =>
    this._sign === 1
      ? BigDecimalFlyweight.NEGATIVE_INFINITY
      : BigDecimalFlyweight.POSITIVE_INFINITY;
  abs = () => BigDecimalFlyweight.POSITIVE_INFINITY;
  sqrt = () => (this._sign === 1 ? this : BigDecimalFlyweight.NaN);
  round = () => this;
  precision = () => this;
  power = () => this;
  modulo = () => BigDecimalFlyweight.NaN;

  // Arithmetic aliases
  plus = this.add;
  minus = this.subtract;
  times = this.multiply;
  div = this.divide;
  pow = this.power;
  mod = this.modulo;

  // Formatting operations
  MAX_DECIMALS!: number;
  toNumber = () => this.valueOf();
  toFixed = () => this.toString();
  toExponential = () => this.toString();
  toEngineering = () => this.toString();

  // Comparison operations
  compareTo = () => 0;
  equals = () => false;
  lessThan = () => false;
  lessThanOrEqual = () => false;
  greaterThan = () => false;
  greaterThanOrEqual = () => false;
  max = () => this;
  min = () => this;

  // Comparison aliases
  eq = this.equals;
  lt = this.lessThan;
  lte = this.lessThanOrEqual;
  gt = this.greaterThan;
  gte = this.greaterThanOrEqual;
}
