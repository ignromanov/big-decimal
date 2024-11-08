import { BigDecimal } from "@/core/base";
import { validateSign } from "@/utils/validation";

/**
 * Special BigDecimal implementation for Infinity
 */
export class InfiniteBigDecimal extends BigDecimal {
  /**
   * @internal
   */
  protected _value: null = null;
  protected _sign: 1 | -1;

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
   * @public
   */
  static readonly POSITIVE = new InfiniteBigDecimal(1);
  static readonly NEGATIVE = new InfiniteBigDecimal(-1);

  /**
   * @internal
   */
  private constructor(sign: 1 | -1) {
    super();
    validateSign(sign);
    this._sign = sign;
    Object.freeze(this);
  }
}
