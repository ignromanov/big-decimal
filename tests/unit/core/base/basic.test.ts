import { BigDecimalFactory as BD } from "@/core";
import { beforeAll, describe, it } from "vitest";
import { eq } from "~/setup";

beforeAll(() => {
  BD.config({
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: 4,
    EXPONENTIAL_AT: [-7, 20],
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
  });
});
describe("basic decimal apps test", () => {
  const basicCases = [["0.1", "0.2", "0.2", "0.06"]] as const;

  it.each(basicCases)(
    "should handle basic cases",
    (input1, input2, input3, expected) => {
      eq(
        expected,
        BD.from(input1).plus(input2).times(input3),
        `[input: ${input1}, ${input2}, ${input3}]`
      );
    }
  );
});
