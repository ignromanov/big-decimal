/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck - We're testing invalid inputs intentionally in this file
/* eslint-enable @typescript-eslint/ban-ts-comment */

import { BigDecimalFactory as BD } from "@/core";
import { beforeAll, describe, it } from "vitest";
import { ex } from "~/setup";

beforeAll(() => {
  BD.config({
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: 4,
    EXPONENTIAL_AT: 1e9,
    POWER_RANGE: 1e9,
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
  });
  // BD = BasicBD.register(ParsingModule);
  // BD = createBigDecimalConfig({
  //   modules: {
  //     arithmetic: true,
  //   },
  //   DECIMAL_PLACES: 20,
  //   ROUNDING_MODE: 4,
  //   EXPONENTIAL_AT: 1e9,
  //   RANGE: 1e9,
  //   ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
  // });
  // const BD = newBD("123.456");
});

describe("special values errors", () => {
  describe("invalid Infinity formats", () => {
    const invalidInfinityInputs = [
      ".Infinity",
      ". Infinity",
      ".-Infinity",
      ".+Infinity",
      "-.Infinity",
      "+.Infinity",
      "Infinity.",
      "Infinity.0",
      "Infinity+",
      "Infinity-",
      "InfinityE",
      "INFINITY",
    ] as const;

    it.each(invalidInfinityInputs)("should throw on '%s'", (input) => {
      ex(() => BD.from(input), input);
    });
  });

  describe("invalid NaN formats", () => {
    const invalidNaNInputs = [
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

    it.each(invalidNaNInputs)("should throw on '%s'", (input) => {
      ex(() => BD.from(input), input);
    });
  });
});

describe("numeric format errors", () => {
  describe("invalid zero formats", () => {
    const invalidZeroInputs = [
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
    ] as const;

    it.each(invalidZeroInputs)("should throw on '%s'", (input) => {
      ex(() => BD.from(input), input);
    });
  });

  describe("invalid number formats", () => {
    const invalidNumberInputs = [
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
    ] as const;

    it.each(invalidNumberInputs)("should throw on '%s'", (input) => {
      ex(() => BD.from(input), input);
    });
  });

  describe("invalid decimal points", () => {
    const invalidDecimalInputs = [
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
    ] as const;

    it.each(invalidDecimalInputs)("should throw on '%s'", (input) => {
      ex(() => BD.from(input), input);
    });
  });
});

describe("base format errors", () => {
  describe("invalid hex formats", () => {
    const invalidHexInputs = [
      ["0x", 16],
      ["0x.", 16],
      ["+0x", 16],
      [".0x1", 16],
      ["0x1", 15],
      ["0x1", 17],
      ["0xG", 16],
      ["0x-1", 16],
      ["0x+1", 16],
      ["0x1.1", 16],
      ["0x.1", 16],
      ["0x1.", 16],
    ] as const;

    it.each(invalidHexInputs)(
      "should throw on '%s' with base %d",
      (input, base) => {
        ex(() => BD.from(input, base), `${input}, ${base}`);
      }
    );
  });

  describe("invalid binary formats", () => {
    const invalidBinaryInputs = [
      ["0b", 2],
      ["0b.", 2],
      ["+0b", 2],
      [".0b1", 2],
      ["0b1", 3],
      ["0b2", 2],
      ["0b-1", 2],
      ["0b+1", 2],
      ["0b1.1", 2],
      ["0b.1", 2],
      ["0b1.", 2],
      ["0b1 1", 2],
    ] as const;

    it.each(invalidBinaryInputs)(
      "should throw on '%s' with base %d",
      (input, base) => {
        ex(() => BD.from(input, base), `${input}, ${base}`);
      }
    );
  });

  describe("invalid octal formats", () => {
    const invalidOctalInputs = [
      ["0o", 8],
      ["0o.", 8],
      [".0o1", 8],
      ["0 o1", 8],
      ["0o 1", 8],
      ["0-o1", 8],
      ["0o1", 16],
      ["0o8", 8],
      ["0o-1", 8],
      ["0o+1", 8],
      ["0o1.1", 8],
      ["0o.1", 8],
    ] as const;

    it.each(invalidOctalInputs)(
      "should throw on '%s' with base %d",
      (input, base) => {
        ex(() => BD.from(input, base), `${input}, ${base}`);
      }
    );
  });
});

describe("general input errors", () => {
  it("should throw on undefined and null values", () => {
    ex(() => BD.from(undefined), "undefined");
    ex(() => BD.from(null), "null");
  });

  describe("invalid strings", () => {
    const invalidStrings = [
      "",
      " ",
      "  ",
      "\t",
      "\n",
      "\r",
      "abc",
      "12x",
      "e4",
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
    ] as const;

    it.each(invalidStrings)("should throw on '%s'", (input) => {
      ex(
        () => BD.from(input),
        input === ""
          ? "(empty string)"
          : input.trim() === ""
          ? "(whitespace)"
          : input
      );
    });
  });

  describe("invalid bases", () => {
    const invalidBases = [
      0,
      1,
      37,
      -1,
      1.5,
      NaN,
      Infinity,
      "16",
      true,
      false,
      [],
      {},
    ] as const;

    it.each(invalidBases)("should throw on invalid base %s", (base) => {
      ex(() => BD.from("1", base), `[base: ${base}]`);
    });
  });
});
