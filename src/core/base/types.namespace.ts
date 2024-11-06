import type { BigDecimal } from "./abstract-decimal.class";

export namespace BigDecimalTypes {
  /** Raw values for direct BigDecimal creation */
  export interface RawValues {
    value: bigint | null;
    exp: number;
    sign: 1 | -1 | null;
  }

  /** Non-null raw values for regular numbers */
  export type NonNullRawValues = {
    value: NonNullable<RawValues["value"]>;
    exp: RawValues["exp"];
    sign: NonNullable<RawValues["sign"]>;
  };

  /** All valid input types for BigDecimal creation */
  export type Value = string | number | bigint | BigDecimal | RawValues;
  export type Base = number | undefined | null;

  /** Interface for BigDecimal constructor */
  export interface BigDecimalConstructor {
    new (value: Value, base?: Base): BigDecimal;
    create(value: Value, base?: Base): BigDecimal;
    from(value: Value, base?: Base): BigDecimal;
    isValid(value: unknown): boolean;
    fromRawValues(
      value: RawValues["value"],
      exp: RawValues["exp"],
      sign: RawValues["sign"]
    ): BigDecimal;

    readonly NaN: BigDecimal;
    readonly POSITIVE_INFINITY: BigDecimal;
    readonly NEGATIVE_INFINITY: BigDecimal;
    readonly zero: BigDecimal;
    readonly fr: typeof BigDecimal.from;
  }

  /** Interface for arithmetic operations */
  export interface BigDecimalOperations {
    plus(other: Value): BigDecimal;
    minus(other: Value): BigDecimal;
    times(other: Value): BigDecimal;
    div(other: Value, scale?: number): BigDecimal;
    pow(n: number): BigDecimal;
    sqrt(scale?: number): BigDecimal;
    abs(): BigDecimal;
    negate(): BigDecimal;
  }

  /** Interface for comparison operations */
  export interface BigDecimalComparison {
    compareTo(other: BigDecimal): number;
    isZero(): boolean;
    isPositive(): boolean;
    isNegative(): boolean;
    isNaN(): boolean;
    isInfinite(): boolean;
    isFinite(): boolean;
  }

  /** Interface for formatting operations */
  export interface BigDecimalFormatting {
    toString(): string;
    toFixed(dp: number): string;
    round(dp: number): BigDecimal;
    [Symbol.toPrimitive](hint: string): number | string;
    valueOf(): number;
  }
}
