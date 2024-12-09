import type { BigDecimalError } from "@/core/errors";

export type ValidationResult = {
  isValid: boolean;
  error?: BigDecimalError;
};

export interface IValidationStrategy {
  validateBase(base: unknown): BigDecimalTypes.Base;
  validateSign(sign: unknown): BigDecimalTypes.Sign;
  validateNullableSign(sign: unknown): BigDecimalTypes.SignOrNull;
  validateRawValues(
    value: unknown,
    exp: unknown,
    sign: unknown
  ): {
    value: bigint;
    exp: number;
    sign: BigDecimalTypes.Sign;
  };
}

export type ValidationMode = "strict" | "relaxed";
