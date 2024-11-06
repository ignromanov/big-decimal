import { BigDecimalErrors } from "@/errors";
import { BigDecimal } from "./abstract-decimal.class";
import type { BigDecimalTypes } from "./types.namespace";

// Arithmetic operations
/**
 * Adds another value to this one
 * @param other - Value to add
 * @returns Result of addition
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("1.23");
 * const b = a.plus("4.56"); // 5.79
 * ```
 */
export function plus(_other: BigDecimalTypes.Value): BigDecimal {
  throw BigDecimalErrors.notImplemented("plus");
}

/**
 * Subtracts another value from this one
 * @param other - Value to subtract
 * @returns Result of subtraction
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("5.67");
 * const b = a.minus("1.23"); // 4.44
 * ```
 */
export function minus(_other: BigDecimalTypes.Value): BigDecimal {
  throw BigDecimalErrors.notImplemented("minus");
}

/**
 * Multiplies this value by another
 * @param other - Value to multiply by
 * @returns Result of multiplication
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("2.5");
 * const b = a.times("3"); // 7.5
 * ```
 */
export function multipliedBy(_other: BigDecimalTypes.Value): BigDecimal {
  throw BigDecimalErrors.notImplemented("multipliedBy");
}

/**
 * Divides this value by another
 * @param other - Value to divide by
 * @param scale - Number of decimal places in result
 * @returns Result of division
 * @throws {Error} If dividing by zero
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("7.5");
 * const b = a.div("2", 2); // 3.75
 * ```
 */
export function div(
  _other: BigDecimalTypes.Value,
  _exp?: typeof BigDecimal.prototype.exp
): BigDecimal {
  throw BigDecimalErrors.notImplemented("div");
}

/**
 * Raises this value to the power of n
 * @param n - Power to raise to
 * @returns Result of exponentiation
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("2");
 * const b = a.pow(3); // 8
 * ```
 */
export function pow(_n: number): BigDecimal {
  throw BigDecimalErrors.notImplemented("pow");
}

/**
 * Calculates the square root of this value
 * @param scale - Number of decimal places in result
 * @returns Square root
 * @throws {Error} If value is negative
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("16");
 * const b = a.sqrt(2); // 4.00
 * ```
 */
export function sqrt(_exp?: typeof BigDecimal.prototype.exp): BigDecimal {
  throw BigDecimalErrors.notImplemented("sqrt");
}

/**
 * Absolute value of the BigDecimal
 * @returns Absolute value
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("-1.23");
 * const b = a.absoluteValue(); // 1.23
 * ```
 */
export function absoluteValue(): BigDecimal {
  throw BigDecimalErrors.notImplemented("absoluteValue");
}

// /**
//  * Returns the absolute value
//  * @returns Absolute value
//  *
//  * @example
//  * ```ts
//  * const a = BigDecimal.from("-1.23");
//  * const b = a.abs(); // 1.23
//  * ```
//  */
// export function abs(): BigDecimal {
//   return this.absoluteValue();
// }

/**
 * Returns the negation of this value
 * @returns Negated value
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("1.23");
 * const b = a.negate(); // -1.23
 * ```
 */
export function negate(): BigDecimal {
  throw BigDecimalErrors.notImplemented("negate");
}

// Comparison operations
/**
 * Compares this value with another
 * @param other - Value to compare with
 * @returns -1 if less, 0 if equal, 1 if greater
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("1.23");
 * a.compareTo("1.24"); // -1
 * ```
 */
export function compareTo(_other: BigDecimal): number {
  throw BigDecimalErrors.notImplemented("compareTo");
}

/**
 * Checks if value equals zero
 * @returns True if value is zero
 */
export function isZero(): boolean {
  throw BigDecimalErrors.notImplemented("isZero");
}

/**
 * Checks if value is greater than zero
 * @returns True if value is positive
 */
export function isPositive(): boolean {
  throw BigDecimalErrors.notImplemented("isPositive");
}

/**
 * Checks if value is less than zero
 * @returns True if value is negative
 */
export function isNegative(): boolean {
  throw BigDecimalErrors.notImplemented("isNegative");
}

// Formatting operations
/**
 * Converts value to string representation
 * @returns String representation of value
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("1.23");
 * a.toString(); // "1.23"
 * ```
 */
export function toString(): string {
  throw BigDecimalErrors.notImplemented("toString");
}

/**
 * Returns string with fixed number of decimal places
 * @param dp - Number of decimal places
 * @returns Formatted string
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("1.2345");
 * a.toFixed(2); // "1.23"
 * ```
 */
export function toFixed(_dp: number): string {
  throw BigDecimalErrors.notImplemented("toFixed");
}

/**
 * Rounds value to specified number of decimal places
 * @param dp - Number of decimal places
 * @returns Rounded value
 *
 * @example
 * ```ts
 * const a = BigDecimal.from("1.2345");
 * const b = a.round(2); // 1.23
 * ```
 */
export function round(_dp: number): BigDecimal {
  throw BigDecimalErrors.notImplemented("round");
}

// Type conversion
