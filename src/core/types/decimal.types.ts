/**
 * Core type definitions for decimal arithmetic implementation.
 * Provides type definitions for the BigDecimal library.
 */

import type {
  Config as BigDecimalConfig,
  Format as BigDecimalFormat,
} from "./decimal.config";

/**
 * Basic type aliases for common values used throughout the library
 */

declare global {
  export namespace BigDecimalTypes {
    // =====================================================
    // Core Interfaces
    // =====================================================

    /** Base type for all decimal values */
    export interface IAbstractDecimal
      extends IArithmeticOperations,
        IFormattingOperations,
        IComparisonOperations {
      /** The numerical value */
      readonly value: ValueOrNull;
      /** The exponent */
      readonly exp: number;
      /** The sign */
      readonly sign: SignOrNull;

      /** Checks if value is zero */
      isZero(): boolean;
      /** Checks if value is positive */
      isPositive(): boolean;
      /** Checks if value is negative */
      isNegative(): boolean;

      /** Type guard for regular decimal */
      isRegular(): this is IRegularDecimal;
      /** Type guard for NaN */
      isNaN(): this is INaNDecimal;
      /** Type guard for Infinity */
      isInfinite(): this is IInfinityDecimal;
      /** Type guard for finite values */
      isFinite(): this is IRegularDecimal;

      /** Converts to primitive number */
      valueOf(): number;
      /** Converts to string representation */
      toString(): string;
      /** Primitive type conversion */
      [Symbol.toPrimitive](
        hint: "string" | "number" | "default"
      ): string | number;
    }

    /** Complete BigDecimal interface */
    export interface IRegularDecimal extends IAbstractDecimal {
      readonly value: Value;
      readonly sign: Sign;
    }

    /** Type for special decimal values */
    export interface ISpecialDecimal extends IAbstractDecimal {
      readonly value: null;
      readonly sign: SignOrNull;
      readonly exp: number;
    }

    /** Type for NaN decimal values */
    export interface INaNDecimal extends ISpecialDecimal {
      readonly value: null;
      readonly sign: null;
      valueOf(): number;
      toString(): string;
    }

    /** Type for Infinity decimal values */
    export interface IInfinityDecimal extends ISpecialDecimal {
      readonly value: null;
      readonly sign: Sign;
      valueOf(): number;
      toString(): string;
    }

    export type IBigDecimal = IRegularDecimal | IInfinityDecimal | INaNDecimal;

    // =====================================================
    // Operation Interfaces
    // =====================================================

    /** Arithmetic operations interface */
    export interface IArithmeticOperations<
      T extends IBigDecimal = IBigDecimal
    > {
      /** Adds two decimals */
      add(this: T, other: Input): IBigDecimal;
      /** Subtracts another decimal */
      subtract(this: T, other: Input): IBigDecimal;
      /** Multiplies by another decimal */
      multiply(this: T, other: Input): IBigDecimal;
      /** Divides by another decimal with optional precision */
      divide(this: T, other: Input, precision?: number): IBigDecimal;
      /** Returns the negation */
      negate(this: T): IBigDecimal;
      /** Returns the absolute value */
      abs(this: T): IBigDecimal;
      /** Returns the square root */
      sqrt(this: T): IBigDecimal;
      /** Rounds to specified decimal places */
      round(this: T, precision: number): IBigDecimal;
      /** Sets significant digits precision */
      precision(this: T, precision: number): IBigDecimal;
      /** Raises to the power */
      power(this: T, exponent: Input): IBigDecimal;
      /** Returns the modulo */
      modulo(this: T, divisor: Input): IBigDecimal;
      /** Alias for add */
      plus: IArithmeticOperations<T>["add"];
      /** Alias for subtract */
      minus: IArithmeticOperations<T>["subtract"];
      /** Alias for multiply */
      times: IArithmeticOperations<T>["multiply"];
      /** Alias for divide */
      div: IArithmeticOperations<T>["divide"];
      /** Alias for power */
      pow: IArithmeticOperations<T>["power"];
      /** Alias for modulo */
      mod: IArithmeticOperations<T>["modulo"];
    }

    /** Formatting operations interface */
    export interface IFormattingOperations {
      /** Formats with fixed decimal places */
      toFixed(decimalPlaces?: number): string;
      /** Formats in exponential notation */
      toExponential(decimalPlaces?: number): string;
      /** Formats in engineering notation */
      toEngineering(decimalPlaces?: number): string;
      /** Converts to number */
      toNumber(): number;
      /** Converts to string */
      toString(): string;
    }

    /** Comparison operations interface */
    export interface IComparisonOperations {
      /** Compares with another decimal */
      compareTo(other: Input): number;
      /** Checks if equal to another decimal */
      equals(other: Input): boolean;
      /** Checks if less than another decimal */
      lessThan(other: Input): boolean;
      /** Checks if less than or equal to another decimal */
      lessThanOrEqual(other: Input): boolean;
      /** Checks if greater than another decimal */
      greaterThan(other: Input): boolean;
      /** Checks if greater than or equal to another decimal */
      greaterThanOrEqual(other: Input): boolean;
      /** Returns the maximum of two decimals */
      max(other: Input): IAbstractDecimal;
      /** Returns the minimum of two decimals */
      min(other: Input): IAbstractDecimal;

      // Aliases
      /** Alias for equals */
      eq: IComparisonOperations["equals"];
      /** Alias for lessThan */
      lt: IComparisonOperations["lessThan"];
      /** Alias for lessThanOrEqual */
      lte: IComparisonOperations["lessThanOrEqual"];
      /** Alias for greaterThan */
      gt: IComparisonOperations["greaterThan"];
      /** Alias for greaterThanOrEqual */
      gte: IComparisonOperations["greaterThanOrEqual"];
    }

    /** Validation module interface */
    export interface IValidationModule {
      validateBase(base: unknown): asserts base is Base;
      validateSign(sign: unknown): asserts sign is Sign;
      validateNullableSign(sign: unknown): asserts sign is SignOrNull;
      validateValue(value: unknown): asserts value is Value;
      validateExp(exp: unknown): asserts exp is Exp;
    }

    // =====================================================
    // Configuration Types
    // =====================================================

    // Instead of re-export, define type aliases
    export type Config = BigDecimalConfig;
    export type Format = BigDecimalFormat;

    /** Factory creation options */
    export interface FactoryOptions extends Config {
      /** Whether to use cached values */
      useCache?: boolean;
      /** Whether to use flyweight pattern */
      useFlyweight?: boolean;
    }

    // =====================================================
    // Value Types
    // =====================================================

    /** Sign of a decimal number: 1 for positive, -1 for negative */
    export type Sign = 1 | -1;

    /** Sign including null for special values like NaN */
    export type SignOrNull = Sign | null;

    /** Internal value representation using BigInt */
    export type Value = bigint;

    /** Value that can be null for special cases (NaN, Infinity) */
    export type ValueOrNull = Value | null;

    /** Exponent for decimal point position */
    export type Exp = number;

    /**
     * Base (radix) for number representation
     * Can be a number between 2 and 36
     */
    export type Base = number;

    /** Base including null for special cases (NaN, Infinity) */
    export type BaseOrNull = Base | null | undefined;

    /**
     * Valid input types for decimal creation.
     * Supports primitive types (number, string, boolean, bigint),
     * special values (null, undefined), raw decimal values, and BigDecimal instances.
     */
    export type Input =
      | DecimalInternal
      | IAbstractDecimal
      | string
      | number
      | bigint
      | boolean;

    /**
     * Raw decimal value parameters.
     * Used for internal decimal representation and caching.
     */
    export interface DecimalInternal {
      value: Value;
      exp: Exp;
      sign: Sign;
    }

    /** Raw decimal value structure */
    export interface RawDecimal {
      value: ValueOrNull;
      exp: Exp;
      sign: SignOrNull;
    }

    /** Represents special decimal values (NaN, Infinity) */
    export type SpecialValue = {
      readonly type: "NaN" | "Infinity";
      readonly sign: SignOrNull;
    };

    /** Represents regular decimal values */
    export type RegularValue = {
      readonly type: "Regular";
      readonly value: Value;
      readonly exp: Exp;
      readonly sign: Sign;
    };

    /** Union type for all possible decimal values */
    export type DecimalValue = RegularValue | SpecialValue;
  }
}
