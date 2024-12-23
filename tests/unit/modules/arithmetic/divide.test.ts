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

describe("divide", () => {
  const variousDivideCases = [
    ["0", "1", "0"],
    ["1", "1", "1"],
    ["4", "2", "2"],
    ["9", "3", "3"],
    ["-4", "2", "-2"],
    ["4", "-2", "-2"],
    ["-4", "-2", "2"],
    ["1", "3", "0.3333333333333333333"],
    ["10", "3", "3.333333333333333333"],
    ["1", "2", "0.5"],
    ["1e6", "1e3", "1000"],
    ["0", "0", "NaN"],
    ["1", "0", "Infinity"],
    ["-1", "0", "-Infinity"],
    ["Infinity", "2", "Infinity"],
    ["Infinity", "-2", "-Infinity"],
  ] as const;

  it.each(variousDivideCases)(
    "should divide %s by %s to get %s",
    (dividend, divisor, expected) => {
      eq(
        expected.toString(),
        BD.from(dividend).divide(divisor),
        `[dividend: ${dividend}, divisor: ${divisor}]`
      );
    }
  );
});
