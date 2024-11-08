import { BigDecimal } from "@/core/base";

/**
 * Special BigDecimal implementation for NaN
 */
export class NaNBigDecimal extends BigDecimal {
  private static _instance: NaNBigDecimal;

  protected _value: null = null;

  protected _sign: null = null;

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

  private constructor() {
    super();
    Object.freeze(this);
  }

  static get instance(): NaNBigDecimal {
    if (!NaNBigDecimal._instance) {
      NaNBigDecimal._instance = new NaNBigDecimal();
    }
    return NaNBigDecimal._instance;
  }
}
