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

describe("min", () => {
  const variousMinCases = [
    ["0", "0", "0"],
    ["1", "1", "1"],
    ["2", "1", "1"],
    ["1", "2", "1"],
    ["-1", "1", "-1"],
    ["1", "-1", "-1"],
    ["-2", "-1", "-2"],
    ["-1", "-2", "-2"],
    ["0.1", "0.1", "0.1"],
    ["0.2", "0.1", "0.1"],
    ["0.1", "0.2", "0.1"],
    ["1e6", "1e5", "100000"],
    ["1e5", "1e6", "100000"],
    ["Infinity", "1", "1"],
    ["-Infinity", "1", "-Infinity"],
    ["1", "Infinity", "1"],
    ["1", "-Infinity", "-Infinity"],
    ["Infinity", "Infinity", "Infinity"],
    ["-Infinity", "-Infinity", "-Infinity"],
    ["NaN", "1", "NaN"],
    ["1", "NaN", "NaN"],
    ["NaN", "NaN", "NaN"],
  ] as const;

  it.each(variousMinCases)(
    "should return min of %s and %s to get %s",
    (a, b, expected) => {
      eq(expected, BD.from(a).min(b).toString(), `[a: ${a}, b: ${b}]`);
    }
  );
});
