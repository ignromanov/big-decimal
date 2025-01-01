import type { BigDecimalErrorCode } from "./codes.error";
import type { ErrorDetails } from "./types.error";

export class BigDecimalError extends Error {
  readonly code: BigDecimalErrorCode;
  readonly details?: ErrorDetails;

  constructor(
    message: string,
    code: BigDecimalErrorCode,
    details?: ErrorDetails
  ) {
    super(message);
    this.name = "BigDecimalError";
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, BigDecimalError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }
}

export function isBigDecimalError(error: unknown): error is BigDecimalError {
  return error instanceof BigDecimalError;
}
