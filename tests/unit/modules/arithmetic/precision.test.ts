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

describe("precision", () => {
  const variousPrecisionCases = [
    ["0", 0, "0"],
    ["1", 1, "1"],
    ["1.23", 1, "1.2"],
    ["1.23", 2, "1.23"],
    ["1.23", 3, "1.230"],
    ["123.456", 2, "1.2e+2"],
    ["0.00123", 2, "1.2e-3"],
    ["9999.9", 3, "1.00e+4"],
    ["Infinity", 2, "Infinity"],
    ["-Infinity", 2, "-Infinity"],
  ] as const;

  it.each(variousPrecisionCases)(
    "should set precision of %s to %s digits to get %s",
    (input, precision, expected) => {
      eq(
        expected.toString(),
        BD.from(input).precision(precision),
        `[input: ${input}, precision: ${precision}]`
      );
    }
  );
});
