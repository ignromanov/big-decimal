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

describe("sqrt", () => {
  const variousSqrtCases = [
    ["0", "0"],
    ["1", "1"],
    ["4", "2"],
    ["9", "3"],
    ["2", "1.4142135623730950488"],
    ["0.25", "0.5"],
    ["100", "10"],
    ["1e6", "1000"],
    ["-1", "NaN"],
    ["Infinity", "Infinity"],
  ] as const;

  it.each(variousSqrtCases)(
    "should calculate square root of %s to get %s",
    (input, expected) => {
      eq(expected.toString(), BD.from(input).sqrt(), `[input: ${input}]`);
    }
  );
});
