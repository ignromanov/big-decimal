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

describe.skip("power", () => {
  const variousPowerCases = [
    ["0", "0", "1"],
    ["0", "1", "0"],
    ["1", "0", "1"],
    ["2", "2", "4"],
    ["2", "3", "8"],
    ["3", "2", "9"],
    ["-2", "2", "4"],
    ["-2", "3", "-8"],
    ["2", "-2", "0.25"],
    ["2", "-3", "0.125"],
    ["0.5", "2", "0.25"],
    ["10", "-1", "0.1"],
    ["Infinity", "2", "Infinity"],
    ["-Infinity", "3", "-Infinity"],
  ] as const;

  it.each(variousPowerCases)(
    "should raise %s to power %s to get %s",
    (base, exponent, expected) => {
      eq(
        expected.toString(),
        BD.from(base).power(exponent),
        `[base: ${base}, exponent: ${exponent}]`
      );
    }
  );
});
