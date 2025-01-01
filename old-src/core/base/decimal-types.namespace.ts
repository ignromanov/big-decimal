import type { IArithmeticModule } from "@/old-src/modules/arithmetic/arithmetic.types";
import type { IComparisonModule } from "@/old-src/modules/comparison";
import type { IFormattingModule } from "@/old-src/modules/formatting";
import type { BigDecimalConfig } from "../config";
import type { EnhancedBigDecimal } from "../implementations/enhanced-decimal.class";
import type { AbstractBigDecimal } from "./abstract-decimal.class";

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
  export type Value = string | number | bigint | AbstractBigDecimal | RawValues;
  export type Base = number | undefined | null;

  export type BigDecimal<T extends BigDecimalConfig.ModulesConfig> =
    EnhancedBigDecimal &
      (T["arithmetic"] extends true ? IArithmeticModule : {}) &
      (T["formatting"] extends true ? IFormattingModule : {}) &
      (T["comparison"] extends true ? IComparisonModule : {});
}
