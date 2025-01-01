import type { BigDecimalTypes } from "@/core";

/**
 * Result of successful parsing containing the numeric components
 */
export type ParseResult = BigDecimalTypes.NonNullRawValues;

/**
 * Special value result type
 */
export type SpecialValue =
  | { type: "NaN" }
  | { type: "Infinity"; sign: NonNullable<BigDecimalTypes.RawValues["sign"]> };
