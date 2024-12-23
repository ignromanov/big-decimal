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

describe("round", () => {
  const variousRoundCases = [
    ["0", 0, "0"],
    ["1.4", 0, "1"],
    ["1.5", 0, "2"],
    ["1.6", 0, "2"],
    ["-1.4", 0, "-1"],
    ["-1.5", 0, "-2"],
    ["-1.6", 0, "-2"],
    ["1.234", 2, "1.23"],
    ["1.235", 2, "1.24"],
    ["123.456", -1, "120"],
    ["123.456", -2, "100"],
    ["Infinity", 0, "Infinity"],
    ["-Infinity", 0, "-Infinity"],
  ] as const;

  it.each(variousRoundCases)(
    "should round %s with precision %s to get %s",
    (input, precision, expected) => {
      eq(
        expected.toString(),
        BD.from(input).round(precision),
        `[input: ${input}, precision: ${precision}]`
      );
    }
  );
});
