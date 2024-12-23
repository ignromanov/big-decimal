import { BigDecimalFactory as BD } from "@/core";
import { beforeAll, describe, it } from "vitest";
import { eq } from "~/setup";

beforeAll(() => {
  BD.config({
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: 4,
    EXPONENTIAL_AT: [-7, 20],
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
  });
});

describe("number inputs", () => {
  describe("basic number cases", () => {
    beforeAll(() => {
      BD.config({
        EXPONENTIAL_AT: [-10, 20],
      });
    });

    const numberCases = [
      // Integer numbers
      [0, "0"],
      [1, "1"],
      [-1, "-1"],
      [123, "123"],
      [-123, "-123"],

      // Decimal numbers
      [0.123, "0.123"],
      [-0.123, "-0.123"],
      [1.23, "1.23"],
      [-1.23, "-1.23"],
      [12.34, "12.34"],
      [-12.34, "-12.34"],

      // Numbers with trailing zeros
      [1.2, "1.2"],
      [1.23, "1.23"],
      [1.0, "1"],
      [100.0, "100"],

      // Very small numbers
      [0.000123, "0.000123"],
      [-0.000123, "-0.000123"],
      [1.23e-7, "0.000000123"],
      [-1.23e-7, "-0.000000123"],

      // Very large numbers
      [1.23e7, "12300000"],
      [-1.23e7, "-12300000"],
      [1.23456789e8, "123456789"],
      [-1.23456789e8, "-123456789"],

      // Edge cases with zeros
      [-0, "0"],
      [+0, "0"],
      [0.0, "0"],
      [-0.0, "0"],
      [0.0, "0"],
      [-0.0, "0"],

      // Numbers in scientific notation
      [1e2, "100"],
      [-1e2, "-100"],
      [1.23e-2, "0.0123"],
      [-1.23e-2, "-0.0123"],
      [1.23e2, "123"],
      [-1.23e2, "-123"],

      // Numbers with maximum JavaScript precision
      [0.1 + 0.2, "0.30000000000000004"], // Check precision
      [1.23456789123456789, "1.234567891234568"], // IEEE 754 rounding
      [-1.23456789123456789, "-1.234567891234568"],

      // Special values with IEEE 754 precision
      [Number.MAX_SAFE_INTEGER, "9007199254740991"],
      [-Number.MAX_SAFE_INTEGER, "-9007199254740991"],
      [Number.MIN_SAFE_INTEGER, "-9007199254740991"],
      [-Number.MIN_SAFE_INTEGER, "9007199254740991"],
    ] as const;

    it.each(numberCases)(
      "should handle number %s correctly",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });

  describe.skip("number precision edge cases", () => {
    const precisionCases = [
      // Check rounding
      [0.1 + 0.2, "0.3"],
      [0.7 + 0.1, "0.8"],
      [0.3 - 0.1, "0.2"],

      // Numbers with many decimal digits
      [1 / 3, "0.3333333333333333"],
      [-1 / 3, "-0.3333333333333333"],
      [2 / 3, "0.6666666666666666"],
      [-2 / 3, "-0.6666666666666666"],

      // Periodic fractions
      [1 / 6, "0.1666666666666667"],
      [1 / 7, "0.14285714285714285"],
      [1 / 11, "0.09090909090909091"],

      // Very small numbers close to zero
      [Number.EPSILON, "2.220446049250313e-16"],
      [-Number.EPSILON, "-2.220446049250313e-16"],
      [Number.MIN_VALUE, "5e-324"],
      [-Number.MIN_VALUE, "-5e-324"],
    ] as const;

    it.each(precisionCases)(
      "should handle precision edge case %s",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });
});

describe("string inputs", () => {
  describe("decimal formats", () => {
    const decimalInputs = [
      // Simple decimal numbers
      ["1.23", "1.23"],
      ["-1.23", "-1.23"],
      ["+1.23", "1.23"],

      // Numbers with leading zeros
      ["00.123", "0.123"],
      ["000123", "123"],
      ["-00.123", "-0.123"],

      // Numbers with trailing zeros
      ["1.2300", "1.23"],
      ["1.0", "1"],
      ["100.00", "100"],

      // Very small numbers
      ["0.000123", "0.000123"],
      ["-0.000123", "-0.000123"],
      ["0.00000", "0"],

      // Very large numbers
      ["123456789.123456789", "123456789.123456789"],
      ["-123456789.123456789", "-123456789.123456789"],
    ] as const;

    it.each(decimalInputs)(
      "should handle decimal format '%s'",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });
});

describe("bigint inputs", () => {
  describe("basic bigint cases", () => {
    const bigintCases = [
      [0n, "0"],
      [1n, "1"],
      [-1n, "-1"],
      [123n, "123"],
      [-123n, "-123"],
    ] as const;

    it.each(bigintCases)("should handle bigint input %s", (input, expected) => {
      eq(expected, BD.from(input), `[input: ${input}]`);
    });
  });
});

describe("raw decimal inputs", () => {
  describe("basic raw decimal cases", () => {
    const rawDecimalCases = [
      [{ value: 0n, exp: 0, sign: 1 }, "0"],
      [{ value: 0n, exp: 0, sign: -1 }, "0"],
      [{ value: 0n, exp: 1, sign: 1 }, "0"],
      [{ value: 0n, exp: 1, sign: -1 }, "0"],
      [{ value: 1n, exp: 0, sign: 1 }, "1"],
      [{ value: 1n, exp: 0, sign: -1 }, "-1"],
      [{ value: 1n, exp: 1, sign: 1 }, "10"],
      [{ value: 1n, exp: 1, sign: -1 }, "-10"],
      [{ value: 1n, exp: -1, sign: 1 }, "0.1"],
      [{ value: 1n, exp: -1, sign: -1 }, "-0.1"],
      [{ value: 123n, exp: 0, sign: 1 }, "123"],
      [{ value: 123n, exp: 0, sign: -1 }, "-123"],
      [{ value: 123n, exp: 1, sign: 1 }, "1230"],
      [{ value: 123n, exp: 1, sign: -1 }, "-1230"],
      [{ value: 123n, exp: -1, sign: 1 }, "12.3"],
      [{ value: 123n, exp: -1, sign: -1 }, "-12.3"],
      [{ value: 123n, exp: -2, sign: 1 }, "1.23"],
      [{ value: 123n, exp: -2, sign: -1 }, "-1.23"],
      [{ value: 123n, exp: -3, sign: 1 }, "0.123"],
      [{ value: 123n, exp: -3, sign: -1 }, "-0.123"],
      [{ value: 123n, exp: -4, sign: 1 }, "0.0123"],
      [{ value: 123n, exp: -4, sign: -1 }, "-0.0123"],
      [{ value: 99999999999999n, exp: 0, sign: 1 }, "99999999999999"],
      [{ value: 99999999999999n, exp: 0, sign: -1 }, "-99999999999999"],
      [{ value: 100000000000000n, exp: 0, sign: 1 }, "100000000000000"],
      [{ value: 100000000000000n, exp: 0, sign: -1 }, "-100000000000000"],
      [{ value: 99999999999999n, exp: 1, sign: 1 }, "999999999999990"],
      [{ value: 99999999999999n, exp: 1, sign: -1 }, "-999999999999990"],
      [{ value: 999999999999999n, exp: -1, sign: 1 }, "99999999999999.9"],
      [{ value: 999999999999999n, exp: -1, sign: -1 }, "-99999999999999.9"],
      [{ value: 9999999999999999n, exp: -2, sign: 1 }, "99999999999999.99"],
      [{ value: 9999999999999999n, exp: -2, sign: -1 }, "-99999999999999.99"],
      [{ value: 99999999999999999n, exp: -3, sign: 1 }, "99999999999999.999"],
      [{ value: 99999999999999999n, exp: -3, sign: -1 }, "-99999999999999.999"],
      [{ value: 999999999999999999n, exp: -4, sign: 1 }, "99999999999999.9999"],
      [
        { value: 999999999999999999n, exp: -4, sign: -1 },
        "-99999999999999.9999",
      ],
      [
        { value: 9999999999999999999n, exp: -5, sign: 1 },
        "99999999999999.99999",
      ],
      [
        { value: 9999999999999999999n, exp: -5, sign: -1 },
        "-99999999999999.99999",
      ],
      [
        { value: 99999999999999999999n, exp: -6, sign: 1 },
        "99999999999999.999999",
      ],
      [
        { value: 99999999999999999999n, exp: -6, sign: -1 },
        "-99999999999999.999999",
      ],
      [
        { value: 999999999999999999999n, exp: -7, sign: 1 },
        "99999999999999.9999999",
      ],
      [
        { value: 999999999999999999999n, exp: -7, sign: -1 },
        "-99999999999999.9999999",
      ],
      [
        { value: 9999999999999999999999n, exp: -8, sign: 1 },
        "99999999999999.99999999",
      ],
      [
        { value: 9999999999999999999999n, exp: -8, sign: -1 },
        "-99999999999999.99999999",
      ],
      [
        { value: 99999999999999999999999n, exp: -9, sign: 1 },
        "99999999999999.999999999",
      ],
      [
        { value: 99999999999999999999999n, exp: -9, sign: -1 },
        "-99999999999999.999999999",
      ],
      [
        { value: 999999999999999999999999n, exp: -10, sign: 1 },
        "99999999999999.9999999999",
      ],
      [
        { value: 999999999999999999999999n, exp: -10, sign: -1 },
        "-99999999999999.9999999999",
      ],
      [
        { value: 9999999999999900000000000009n, exp: -14, sign: 1 },
        "99999999999999.00000000000009",
      ],
      [
        { value: 9999999999999900000000000009n, exp: -14, sign: -1 },
        "-99999999999999.00000000000009",
      ],
      [
        { value: 99999999999999123456789876543n, exp: -15, sign: 1 },
        "99999999999999.123456789876543",
      ],
      [
        { value: 99999999999999123456789876543n, exp: -15, sign: -1 },
        "-99999999999999.123456789876543",
      ],
      [
        { value: 99999999999999123456789876543n, exp: -22, sign: 1 },
        "9999999.9999999123456789876543",
      ],
      [
        { value: 99999999999999123456789876543n, exp: -22, sign: -1 },
        "-9999999.9999999123456789876543",
      ],
    ] as const;

    it.each(rawDecimalCases)(
      "should handle raw decimal input %s",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });
});

describe("BigDecimal inputs", () => {
  describe("basic BigDecimal cases", () => {
    const bigDecimalCases = [
      [BD.from(123), "123"],
      [BD.from(-123), "-123"],
      [BD.from(1.23), "1.23"],
      [BD.from(-1.23), "-1.23"],
      [BD.from(12.34), "12.34"],
      [BD.from(-12.34), "-12.34"],
    ] as const;

    it.each(bigDecimalCases)(
      "should handle BigDecimal input %s",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });
});

describe("null and undefined inputs", () => {
  beforeAll(() => {
    BD.config({
      STRICT_MODE: false,
    });
  });

  const nullUndefinedCases = [
    [null, "NaN"],
    [undefined, "NaN"],
  ] as const;

  it.each(nullUndefinedCases)(
    "should handle null or undefined input %s",
    (input, expected) => {
      // @ts-expect-error
      eq(expected, BD.from(input), `[input: ${input}]`);
    }
  );
});

describe("boolean inputs", () => {
  const booleanCases = [
    [true, "1"],
    [false, "0"],
  ] as const;

  it.each(booleanCases)("should handle boolean input %s", (input, expected) => {
    eq(expected, BD.from(input), `[input: ${input}]`);
  });
});

describe("special values", () => {
  describe("Infinity", () => {
    const infinityInputs = [
      [Infinity, "Infinity"],
      [-Infinity, "-Infinity"],
      [+Infinity, "Infinity"],
    ] as const;

    it.each(infinityInputs)("should handle numeric %s", (input, expected) => {
      eq(
        expected,
        BD.from(input),
        `[input: ${input}] ${BD.from(input).toString()}`
      );
    });

    const stringInfinityInputs = [
      "Infinity",
      " Infinity",
      "Infinity ",
      " Infinity ",
      "+Infinity",
      " +Infinity",
      "+Infinity ",
      " +Infinity ",
      "-Infinity",
      " -Infinity",
      "-Infinity ",
      " -Infinity ",
      "+ Infinity",
      " + Infinity",
      "- Infinity",
      " - Infinity",
    ] as const;

    it.each(stringInfinityInputs)("should handle string '%s'", (input) => {
      const expected = input.includes("-") ? "-Infinity" : "Infinity";
      eq(expected, BD.from(input), `[input: ${input}]`);
    });

    const extremeValues = [
      ["-1e10000000000", "-Infinity"],
      ["1e10000000000", "Infinity"],
      ["-1e10000000000", "-Infinity"],
      ["1e-10000000000", "0"],
      ["-1e-10000000000", "0"],
    ] as const;

    it.each(extremeValues)(
      "should handle extreme value %s",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });

  describe("NaN", () => {
    const nanInputs = [NaN, -NaN, +NaN] as const;

    it.each(nanInputs)("should handle numeric %s", (input) => {
      eq("NaN", BD.from(input), `[input: ${input}]`);
    });

    const stringNaNInputs = [
      "NaN",
      " NaN",
      "NaN ",
      " NaN ",
      "+NaN",
      " +NaN",
      "+NaN ",
      " +NaN ",
      "-NaN",
      " -NaN",
      "-NaN ",
      " -NaN ",
      "+ NaN",
      "- NaN",
      " + NaN",
      " - NaN",
    ] as const;

    it.each(stringNaNInputs)("should handle string '%s'", (input) => {
      eq("NaN", BD.from(input), `[input: ${input}]`);
    });
  });

  describe("zero values", () => {
    const zeroInputs = [
      // Numeric zeros
      0,
      -0,
      // Basic string zeros
      "0",
      ".0",
      "0.",
      // Signed zeros
      "-0.",
      "+0.",
      "+0",
      "-0",
      // Zeros with spaces
      " +0",
      " -0",
      " +0 ",
      " -0 ",
      "0 .",
      ". 0",
      // Decimal point variations
      "+.0",
      "-.0",
      " +.0",
      " -.0",
      " +.0 ",
      " -.0 ",
      "+. 0",
      "-. 0",
      // Multiple zeros
      "000.",
      "000.0",
      "000.00",
      "000.000",
      "000.0000",
      "000.00000",
    ] as const;

    it.each(zeroInputs)("should handle zero format '%s'", (input) => {
      eq("0", BD.from(input), `[input: ${input}]`);
    });
  });

  describe("number formats", () => {
    const numberInputs = [
      // Integer formats
      ["+2", "2"],
      ["-2", "-2"],
      [" +2", "2"],
      [" -2", "-2"],
      [" +2 ", "2"],
      [" -2 ", "-2"],
      // Decimal formats
      [".2", "0.2"],
      ["2.", "2"],
      ["-2.", "-2"],
      ["+2.", "2"],
      // Mixed formats
      ["+.2", "0.2"],
      ["-.2", "-0.2"],
      [" +.2", "0.2"],
      [" -.2", "-0.2"],
      [" +.2 ", "0.2"],
      [" -.2 ", "-0.2"],
      ["2 .", "2"],
      [". 2", "0.2"],
      ["+. 2", "0.2"],
      ["-. 2", "-0.2"],
      ["2.2 2", "2.22"],
    ] as const;

    it.each(numberInputs)(
      "should handle number format '%s'",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });

  describe("invalid spacing", () => {
    const invalidSpacingInputs = [
      ["0 0", "0"],
      ["1 1", "11"],
      ["1 .1", "1.1"],
      ["1. 1", "1.1"],
      ["1 . 1", "1.1"],
      ["+ 1", "1"],
      ["- 1", "-1"],
      ["1 e1", "10"],
      ["1e 1", "10"],
      ["1 e +1", "10"],
      ["1 e -1", "0.1"],
    ] as const;

    it.each(invalidSpacingInputs)(
      "should handle invalid spacing on '%s'",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });

  describe.skip("base conversions", () => {
    const baseInputs = [
      // Hexadecimal
      ["0xFF", 16, "255"],
      ["-0xFF", 16, "-255"],
      ["0x0", 16, "0"],
      // Binary
      ["0b11", 2, "3"],
      ["-0b11", 2, "-3"],
      ["0b0", 2, "0"],
      // Octal
      ["0o77", 8, "63"],
      ["-0o77", 8, "-63"],
      ["0o0", 8, "0"],
      // Custom base
      ["zz", 36, "1295"],
      ["-zz", 36, "-1295"],
    ] as const;

    it.each(baseInputs)(
      "should convert %s from base %d to %s",
      (input, base, expected) => {
        eq(expected, BD.from(input, base), `[input: ${input}, base: ${base}]`);
      }
    );
  });

  describe("exponential notation", () => {
    const expInputs = [
      ["1e2", "100"],
      ["1e+2", "100"],
      ["1e-2", "0.01"],
      ["-1e2", "-100"],
      ["-1e+2", "-100"],
      ["-1e-2", "-0.01"],
      ["1.23e2", "123"],
      ["1.23e-2", "0.0123"],
    ] as const;

    it.each(expInputs)(
      "should handle exponential notation %s",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });

  describe("special values with bases", () => {
    const specialBaseInputs = [
      // Testing undefined/null bases
      ["NaN", undefined, "NaN"],
      ["NaN", null, "NaN"],
      [12.345, null, "12.345"],
      [12.345, undefined, "12.345"],

      // Testing NaN with different bases
      [NaN, 2, "NaN"],
      ["-NaN", 2, "NaN"],
      [-NaN, 10, "NaN"],
      ["NaN", 10, "NaN"],

      // Testing Infinity with different bases
      ["Infinity", 2, "Infinity"],
      ["Infinity", 10, "Infinity"],
      ["-Infinity", 2, "-Infinity"],
      ["-Infinity", 10, "-Infinity"],

      // Testing large numbers with different bases
      ["101725686101180", undefined, "101725686101180"],
      ["101725686101180", 10, "101725686101180"],
    ] as const;

    it.each(specialBaseInputs)(
      "should convert %s with base %s to %s",
      (input, base, expected) => {
        eq(expected, BD.from(input, base), `[input: ${input}, base: ${base}]`);
      }
    );
  });
});

describe("exponential notation edge cases", () => {
  beforeAll(() => {
    BD.config({ POWER_RANGE: [-1e20, 1e20], EXPONENTIAL_AT: [-1e20, 1e20] });
  });

  const expEdgeCases = [
    // Zeros in exponential notation
    ["0e0", "0"],
    ["0e+0", "0"],
    ["0e-0", "0"],
    ["0.0e0", "0"],

    // Exponent with leading zeros
    ["1e02", "100"],
    ["1e002", "100"],
    ["1e-02", "0.01"],

    // Combinations of mantissa and exponent
    ["1.200e2", "120"],
    ["0.123e-1", "0.0123"],
    ["00.123e2", "12.3"],

    // Large and small exponents
    ["1e-15", "0.000000000000001"],
    ["1e15", "1000000000000000"],
    ["1.23e-15", "0.00000000000000123"],
  ] as const;

  it.each(expEdgeCases)(
    "should handle exponential edge case '%s'",
    (input, expected) => {
      eq(expected, BD.from(input), `[input: ${input}]`);
    }
  );
});

describe("mixed format edge cases", () => {
  const mixedCases = [
    // Mixed spaces and signs
    [" + 1.23", "1.23"],
    [" - 1.23", "-1.23"],
    ["+ 1.23 ", "1.23"],

    // Unusual combinations of points and zeros
    ["00.", "0"],
    [".00", "0"],
    ["00.00", "0"],

    // Edge cases with spaces
    [" .123 ", "0.123"],
    [" 123. ", "123"],
    [" +.123 ", "0.123"],

    // Mixed formats with exponent
    [" 1.23e+2 ", "123"],
    [" +1.23e-2 ", "0.0123"],
    [" -0.00e-2 ", "0"],
  ] as const;

  it.each(mixedCases)("should handle mixed format '%s'", (input, expected) => {
    eq(expected, BD.from(input), `[input: ${input}]`);
  });
});

describe("nonstrict mode", () => {
  beforeAll(() => {
    BD.config({ STRICT_MODE: false });
  });

  const nonStrictCases = [
    "+-0",
    "-+0",
    "--0",
    "++0",
    ".-0",
    ".+0",
    "..0",
    "+.-0",
    "-.+0",
    ".000.",
    "0.0.0",
    "+-2",
    "-+2",
    "--2",
    "++2",
    ".-2",
    ".+2",
    "..2",
    "+.-2",
    "-.+2",
    "2.2.",
    ".2.2",
    "2..2",
    "+2..",
    "-2..",
    "-.2.",
    "+.2.",
    ".-20.",
    ".+20.",
    ". 20.",
    "1.2.3",
    "1..23",
    "1.2.3.4",
    ".1.2",
    "1..",
    "...",
    "",
    " ",
    "  ",
    "\t",
    "\n",
    "\r",
    "abc",
    "12x",
    "E",
    "e",
    "23er",
    "1e",
    "1e+",
    "1e-",
    "1e.",
    "1e.1",
    "1e1.2",
    "1ee1",
    "1e++1",
    "",
    " ",
    ".",
    "..",
    "1.2.3",
    "e",
    "1e",
    "1e+",
    "1.23e++2",
    "1.23ee2",
    "+-1.23",
    "1.23e2.4",
    ". NaN",
    ".-NaN",
    ".+NaN",
    "-.NaN",
    "+.NaN",
    "NaN.",
    "NaN.0",
    "NaN+",
    "NaN-",
    "NaNE",
    "nan",
    "NAN",
  ] as const;

  it.each(nonStrictCases)("should handle mixed format '%s'", (input) => {
    eq("NaN", BD.from(input), `[input: ${input}]`);
  });
});

// describe("type conversions", () => {
//   const typeConversions = [
//     // BigInt
//     [1n, "1"],
//     [-1n, "-1"],
//     [0n, "0"],

//     // Number
//     [123.456, "123.456"],
//     [-123.456, "-123.456"],
//     [0.123, "0.123"],

//     // Existing BigDecimal
//     [BD.from("1.23"), "1.23"],
//     [BD.from("-1.23"), "-1.23"],
//     [BD.from("0"), "0"],
//   ] as const;

//   it.each(typeConversions)(
//     "should handle type conversion from %s",
//     (input, expected) => {
//       eq(expected, BD.from(input), `[input: ${input}]`);
//     }
//   );
// });
