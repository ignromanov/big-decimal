import { BigDecimalFactory as BD } from "@/core";
import { beforeAll, beforeEach, describe, it } from "vitest";
import { eq } from "~/setup";

beforeEach(() => {
  BD.config({
    DECIMAL_PLACES: 20,
    ROUNDING_MODE: 4,
    EXPONENTIAL_AT: [-7, 20],
    POWER_RANGE: [-1e9, 1e9],
    ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
  });
});

describe("basic formatting", () => {
  describe("basic string formatting", () => {
    const stringCases = [
      ["123.456", "123.456"],
      ["-123.456", "-123.456"],
    ] as const;

    it.each(stringCases)(
      "should handle basic string formatting %s correctly",
      (input, expected) => {
        eq(expected, BD.from(input), `[input: ${input}]`);
      }
    );
  });

  describe("basic rounding  formatting", () => {
    // TODO: DECIMAL_PLACES: 20, base: 2

    describe("ROUNDING_MODE 0", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 0 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["1000", "999.5", 10],
        ["-1000", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 1", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 1 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["999", "999.5", 10],
        ["-999", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 2", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 2 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["1000", "999.5", 10],
        ["-999", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 3", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 3 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["999", "999.5", 10],
        ["-1000", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 4", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 4 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["1000", "999.5", 10],
        ["-1000", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 5", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 5 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["999", "999.5", 10],
        ["-999", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 6", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 6 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["1000", "999.5", 10],
        ["-1000", "-999.5", 10],
        ["999", "999.4", 10],
        ["-999", "-999.4", 10],
        ["1000", "999.500001", 10],
        ["-1000", "-999.500001", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 7", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 7 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["1000", "999.5", 10],
        ["-999", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });

    describe("ROUNDING_MODE 8", () => {
      beforeAll(() => {
        BD.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: 8 });
      });

      const roundingCases = [
        // ["1", "0.1", 2],
        // ["-1", "-0.1", 2],
        ["1000", "999.5", 10],
        ["-1000", "-999.5", 10],
      ] as const;

      it.each(roundingCases)(
        "should handle basic rounding formatting %s correctly",
        (expected, input, precision) => {
          eq(expected, BD.from(input, precision), `[input: ${input}]`);
        }
      );
    });
  });
});
