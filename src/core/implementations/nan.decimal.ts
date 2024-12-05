import { SpecialDecimal } from "@/core/base";

/**
 * Represents Not a Number (NaN) in decimal arithmetic.
 * Implements singleton pattern to ensure only one instance exists.
 *
 * @remarks
 * NaNDecimal is used to represent invalid operations results or undefined values.
 * Any operation involving NaN results in NaN.
 *
 * @example
 * ```typescript
 * const nan = NaNDecimal.instance;
 * console.log(nan.toString()); // "NaN"
 * console.log(nan.valueOf()); // NaN
 *
 * // Type guards
 * if (nan.isNaN()) {
 *   console.log("This is NaN");
 * }
 * ```
 */
export class NaNDecimal
  extends SpecialDecimal
  implements BigDecimalTypes.INaNDecimal
{
  /** Singleton instance */
  private static _instance: BigDecimalTypes.INaNDecimal | null = null;

  /** NaN has no sign */
  protected _sign: null = null;

  /**
   * Private constructor to prevent direct instantiation.
   * Use NaNDecimal.instance to get the singleton instance.
   */
  private constructor() {
    super();
  }

  /**
   * Gets the singleton instance of NaNDecimal.
   * Creates the instance if it doesn't exist.
   */
  public static get instance(): BigDecimalTypes.INaNDecimal {
    if (!NaNDecimal._instance) {
      NaNDecimal._instance = new NaNDecimal();
    }
    return NaNDecimal._instance;
  }

  /** @returns Always null for NaN */
  get sign(): null {
    return this._sign;
  }

  /**
   * Checks if the value is zero
   * @returns Always false as this represents NaN
   */
  isZero(): boolean {
    return false;
  }

  /**
   * Checks if the value is positive
   * @returns Always false as this represents NaN
   */
  isPositive(): boolean {
    return false;
  }

  /**
   * Checks if the value is negative
   * @returns Always false as this represents NaN
   */
  isNegative(): boolean {
    return false;
  }

  /**
   * @returns Always true as this represents NaN
   */
  isNaN(): this is BigDecimalTypes.INaNDecimal {
    return true;
  }

  /**
   * @returns Always false as this represents NaN
   */
  isInfinite(): this is BigDecimalTypes.IInfinityDecimal {
    return false;
  }

  /**
   * @returns JavaScript's NaN
   */
  valueOf(): number {
    return NaN;
  }

  /**
   * @returns "NaN"
   */
  toString(): string {
    return "NaN";
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
  multiply = () => this;
  divide = () => this;
  negate = () => this;
  abs = () => this;
  sqrt = () => this;
  round = () => this;
  precision = () => this;
  power = () => this;
  modulo = () => this;

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
