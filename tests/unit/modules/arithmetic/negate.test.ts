import { BD } from "@/core";
import { beforeAll, describe, it } from "vitest";
import { eq } from "~/setup";

beforeAll(() => {
  BD.config({
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: 1,
    EXPONENTIAL_AT: [-7, 21],
    POWER_RANGE: [-1e20, 1e20],
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
    POW_PRECISION: 0,
    MODULO_MODE: 1,
    STRICT_MODE: false,
    DEFAULT_BASE: 10,
    FORMAT: {
      signedZero: true,
    },
  });
});

describe("negate", () => {
  const variousNegateCases = [
    ["0", "-0"],
    ["-0", "0"],
    ["0", BD.from("0").negate()],

    ["0", "0"],
    ["-1", "1"],
    ["-11.121", "11.121"],
    ["0.023842", "-0.023842"],
    ["1.19", "-1.19"],
    ["-3838.2", "3838.2"],
    ["-127", "127"],
    ["4.23073", "-4.23073"],
    ["2.5469", "-2.5469"],
    ["-2.0685908346593874980567875e+25", "20685908346593874980567875"],
  ] as const;

  it.each(variousNegateCases)(
    "should negate %s to get %s",
    (expected, input) => {
      eq(expected.toString(), BD.from(input).negate(), `[input: ${input}]`);
    }
  );
});
