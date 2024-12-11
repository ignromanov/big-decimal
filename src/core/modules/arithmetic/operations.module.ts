import { abs } from "./abs";
import { add } from "./add";
import { divide } from "./divide";
import { modulo } from "./modulo";
import { multiply } from "./multiply";
import { negate } from "./negate";
import { power } from "./power";
import { precision } from "./precision";
import { round } from "./round";
import { sqrt } from "./sqrt";
import { subtract } from "./subtract";

/**
 * Arithmetic operations module.
 * Provides basic arithmetic operations for decimal numbers.
 */
export const arithmeticModule: BigDecimalTypes.IArithmeticOperations<BigDecimalTypes.IRegularDecimal> =
  {
    // Core operations
    add,
    subtract,
    multiply,
    divide,
    negate,
    abs,
    sqrt,
    round,
    precision,
    power,
    modulo,

    // Aliases
    plus: add,
    minus: subtract,
    times: multiply,
    div: divide,
    pow: power,
    mod: modulo,
  } as const;
