import { compareTo } from "./compare-to";
import { equals } from "./equals";
import { greaterThan } from "./greater-than";
import { greaterThanOrEqual } from "./greater-than-or-equal";
import { lessThan } from "./less-than";
import { lessThanOrEqual } from "./less-than-or-equal";
import { max } from "./max";
import { min } from "./min";

/**
 * Comparison operations module.
 * Provides methods for comparing decimal numbers.
 *
 * @remarks
 * All comparison operations are based on the core compareTo function.
 * Special values (NaN, Infinity) are handled according to IEEE 754.
 * Zero values (0, -0) are considered equal but preserve their sign.
 */
export const comparisonModule: BigDecimalTypes.IComparisonOperations = {
  // Core comparison operations
  compareTo,
  equals,
  lessThan,
  lessThanOrEqual,
  greaterThan,
  greaterThanOrEqual,
  max,
  min,

  // Aliases
  eq: equals,
  lt: lessThan,
  lte: lessThanOrEqual,
  gt: greaterThan,
  gte: greaterThanOrEqual,
} as const;
