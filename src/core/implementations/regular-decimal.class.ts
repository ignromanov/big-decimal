import { BigDecimal } from "@/core/base";

/**
 * A class for arbitrary-precision decimal arithmetic.
 * Supports basic arithmetic operations and maintains precision through calculations.
 * @public
 */
export class RegularBigDecimal extends BigDecimal {
  /** The numerical value stored as a bigint (without sign) or null for special values */
  protected _value: bigint = 0n;

  /** Sign of the number (1 for positive, -1 for negative, null for NaN) */
  protected _sign: 1 | -1 = 1;

  /** Exponent of the number */
  protected _exp: number = 0;

  /**
   * Gets the sign of the number
   * @readonly
   */
  get sign(): typeof this._sign {
    return this._sign;
  }

  /**
   * Gets the numerical value
   * @readonly
   */
  get value(): typeof this._value {
    return this._value;
  }

  /**
   * Gets the exponent of the number
   * @readonly
   */
  get exp(): typeof this._exp {
    return this._exp;
  }

  /**
   * Constructor for RegularBigDecimal
   * @internal
   */
  private constructor() {
    super();
  }

  /**
   * Creates a RegularBigDecimal from raw components
   * @internal
   */
  static fromRawValues(
    value: bigint,
    exp: number,
    sign: 1 | -1
  ): RegularBigDecimal {
    const instance = new RegularBigDecimal();
    instance._value = value;
    instance._exp = exp;
    instance._sign = sign;
    return instance;
  }
}
