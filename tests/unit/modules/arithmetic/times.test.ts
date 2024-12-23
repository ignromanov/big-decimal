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

describe("times", () => {
  const variousTimesCases = [
    ["0", "0", "0"],
    ["2", "3", "6"],
    ["-2", "3", "-6"],
    ["2", "-3", "-6"],
    ["-2", "-3", "6"],
    ["1.5", "2", "3"],
    ["0.1", "0.2", "0.02"],
    ["123.456", "789.012", "97408.265472"],
    ["1e5", "1e-5", "1"],
    ["0", "Infinity", "NaN"],
    ["Infinity", "Infinity", "Infinity"],
    ["-Infinity", "Infinity", "-Infinity"],
  ] as const;

  it.each(variousTimesCases)(
    "should multiply %s and %s to get %s",
    (a, b, expected) => {
      eq(expected.toString(), BD.from(a).multiply(b), `[inputs: ${a}, ${b}]`);
    }
  );
});
