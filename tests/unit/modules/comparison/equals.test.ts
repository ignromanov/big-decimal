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

describe("equals", () => {
  const variousEqualsCases = [
    ["0", "0", true],
    ["1", "1", true],
    ["2", "1", false],
    ["1", "2", false],
    ["-1", "1", false],
    ["1", "-1", false],
    ["-2", "-2", true],
    ["0.1", "0.1", true],
    ["0.2", "0.1", false],
    ["1e6", "1000000", true],
    ["Infinity", "Infinity", false],
    ["-Infinity", "-Infinity", false],
    ["NaN", "NaN", false],
    ["NaN", "1", false],
    ["1", "NaN", false],
  ] as const;

  it.each(variousEqualsCases)(
    "should check if %s equals %s to get %s",
    (a, b, expected) => {
      eq(
        expected.toString(),
        BD.from(a).equals(b).toString(),
        `[a: ${a}, b: ${b}]`
      );
    }
  );
});
