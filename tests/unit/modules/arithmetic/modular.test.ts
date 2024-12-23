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

describe("modulo", () => {
  const variousModuloCases = [
    ["0", "1", "0"],
    ["1", "1", "0"],
    ["5", "2", "1"],
    ["5", "3", "2"],
    ["-5", "2", "-1"],
    ["-5", "3", "-2"],
    ["5.5", "2", "1.5"],
    ["5.5", "2.5", "0.5"],
    ["123.456", "10", "3.456"],
    ["Infinity", "2", "NaN"],
    ["5", "0", "NaN"],
    ["5", "Infinity", "5"],
  ] as const;

  it.each(variousModuloCases)(
    "should calculate %s modulo %s to get %s",
    (dividend, divisor, expected) => {
      eq(
        expected.toString(),
        BD.from(dividend).modulo(divisor),
        `[dividend: ${dividend}, divisor: ${divisor}]`
      );
    }
  );
});
