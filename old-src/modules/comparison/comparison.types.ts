import type { BigDecimalTypes } from "@/core";

/** Interface for comparison operations */
export interface IComparisonModule {
  compareTo(other: BigDecimalTypes.Value): number;
  isZero(): boolean;
  isPositive(): boolean;
  isNegative(): boolean;
  isNaN(): boolean;
  isInfinite(): boolean;
  isFinite(): boolean;
}
