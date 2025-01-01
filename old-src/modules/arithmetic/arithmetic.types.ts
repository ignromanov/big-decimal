import { BigDecimalTypes } from "@/core/base";

export interface IArithmeticModule {
  plus(value: BigDecimalTypes.Value): BigDecimal;
  minus(value: BigDecimalTypes.Value): BigDecimal;
  times(value: BigDecimalTypes.Value): BigDecimal;
  div(value: BigDecimalTypes.Value, scale?: number): BigDecimal;
  pow(n: number): BigDecimal;
  sqrt(scale?: number): BigDecimal;
}
