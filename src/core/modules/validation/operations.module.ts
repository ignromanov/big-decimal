import { BigDecimalError } from "@/core/errors";
import { errorHandlingModule } from "@/core/errors/error-handling.module";

/**
 * Module containing validation functions for BigDecimal operations
 */
export const validationModule: BigDecimalTypes.IValidationModule = {
  /**
   * Validates base (radix) for number parsing
   * @param base - The base to validate
   * @throws {BigDecimalError} If base is invalid
   */
  validateBase: function validateBase(
    base: unknown
  ): asserts base is BigDecimalTypes.Base {
    if (
      typeof base !== "number" ||
      !Number.isInteger(base) ||
      base < 2 ||
      base > 36
    ) {
      throw BigDecimalError.invalidArgument(
        `Base must be an integer between 2 and 36, but got [base: ${base}]`,
        {
          base,
          expected: "2-36",
        }
      );
    }
  },

  /**
   * Validates sign for decimal numbers
   * @param sign - The sign to validate
   * @throws {BigDecimalError} If sign is invalid
   */
  validateSign: function validateSign(
    sign: unknown
  ): asserts sign is BigDecimalTypes.Sign {
    try {
      if (sign !== -1 && sign !== 1) {
        throw BigDecimalError.invalidArgument("Sign must be either 1 or -1", {
          sign,
          expected: "1 or -1",
        });
      }
    } catch (error) {
      // In relaxed mode, default to positive
      errorHandlingModule.handleValidationError(error, () => {
        sign = 1;
      });
    }
  },

  /**
   * Validates nullable sign (for special values like NaN)
   * @param sign - The sign to validate
   * @throws {BigDecimalError} If sign is invalid
   */
  validateNullableSign: function validateNullableSign(
    sign: unknown
  ): asserts sign is BigDecimalTypes.SignOrNull {
    if (sign !== -1 && sign !== 1 && sign !== null) {
      throw BigDecimalError.invalidArgument(
        "Sign must be either 1, -1, or null",
        {
          sign,
          expected: "1, -1, or null",
        }
      );
    }
  },

  /**
   * Validates the coefficient value
   * @param value - The coefficient value to validate
   * @throws {BigDecimalError} If value is invalid
   */
  validateValue: function validateValue(
    value: unknown
  ): asserts value is bigint {
    if (typeof value !== "bigint") {
      throw BigDecimalError.invalidArgument("Value must be a bigint", {
        value,
        type: typeof value,
      });
    }
    if (value < 0n) {
      throw BigDecimalError.invalidArgument("Value must be non-negative", {
        value: value.toString(),
      });
    }
  },

  /**
   * Validates the exponent value
   * @param exp - The exponent value to validate
   * @throws {BigDecimalError} If exponent is invalid
   */
  validateExp: function validateExp(exp: unknown): asserts exp is number {
    if (typeof exp !== "number" || !Number.isFinite(exp)) {
      throw BigDecimalError.invalidArgument(
        "Exponent must be a finite number",
        {
          exp,
          type: typeof exp,
        }
      );
    }
    if (!Number.isInteger(exp)) {
      throw BigDecimalError.invalidArgument("Exponent must be an integer", {
        exp,
      });
    }
  },
} as const;
