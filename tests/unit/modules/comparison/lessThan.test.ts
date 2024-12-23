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

describe("lessThan", () => {
  const variousLessThanCases = [
    ["0", "0", false],
    ["1", "1", false],
    ["2", "1", false],
    ["1", "2", true],
    ["-1", "1", true],
    ["1", "-1", false],
    ["-2", "-1", true],
    ["-1", "-2", false],
    ["0.1", "0.1", false],
    ["0.2", "0.1", false],
    ["0.1", "0.2", true],
    ["1e6", "1e5", false],
    ["1e5", "1e6", true],
    ["Infinity", "1", false],
    ["-Infinity", "1", true],
    ["1", "Infinity", true],
    ["1", "-Infinity", false],
    ["Infinity", "Infinity", false],
    ["-Infinity", "-Infinity", false],
    ["NaN", "1", false],
    ["1", "NaN", false],
    ["NaN", "NaN", false],
  ] as const;

  it.each(variousLessThanCases)(
    "should check if %s is less than %s to get %s",
    (a, b, expected) => {
      eq(
        expected.toString(),
        BD.from(a).lessThan(b).toString(),
        `[a: ${a}, b: ${b}]`
      );
    }
  );
});
