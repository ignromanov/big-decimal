import { createBigDecimalConfig, type BigDecimalTypes } from "@/index";

// Configuration setup
const config = {
  modules: {
    arithmetic: true,
  },
  DECIMAL_PLACES: 20,
  ROUNDING_MODE: 4,
  EXPONENTIAL_AT: 1e9,
  RANGE: 1e9,
  ALPHABET: "0123456789abcdefghijklmnopqrstuvwxyz",
};

// Initialize BigDecimal with config
const BD = createBigDecimalConfig(config);

// Helper function to test and log results
function test(input: string | number, base?: number) {
  try {
    const result = BD(input, base);
    console.log(`Input: ${input}${base ? ` (base ${base})` : ""}`);
    console.log(`Result: ${result.toString()}`);
    console.log("---");
  } catch (error) {
    console.error(`Error for input ${input}: ${error.message}`);
    console.log("---");
  }
}

// Test cases from our test suite
console.log("\n=== Special Values ===");
test("Infinity");
test("-Infinity");
test("NaN");

console.log("\n=== Zero Values ===");
test("0");
test("-0");
test("+0");
test(".0");
test("-.0");

console.log("\n=== Number Formats ===");
test("+2");
test("-2");
test(".2");
test("2.");
test("-2.");
test("+.2");

console.log("\n=== Base Conversions ===");
test("0xFF", 16);
test("-0xFF", 16);
test("0b11", 2);
test("zz", 36);

console.log("\n=== Exponential Notation ===");
test("1e2");
test("1.23e-2");
test("1.200e2");
test("0.123e-1");

console.log("\n=== Decimal Numbers ===");
test("123.456");
test("-123.456");
test("0.000123");
test("123456789.123456789");

// Interactive testing function
function interactive(input: string | number, base?: number) {
  try {
    const bd = BD(input, base);
    console.log("\nResult:", bd.toString());
    console.log("Properties:");
    console.log("- isInteger:", bd.isInteger);
    console.log("- isNegative:", bd.isNegative);
    console.log("- isZero:", bd.isZero);
    console.log("- isNaN:", bd.isNaN);
    console.log("- isFinite:", bd.isFinite);
    console.log("- isInfinite:", bd.isInfinite);
    return bd;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Export for REPL usage
export { BD, test, interactive };

// Usage example:
console.log("\n=== Interactive Example ===");
const num = interactive("123.456");
if (num) {
  console.log("\nArithmetic operations example:");
  console.log("Add 10:", num.plus(10).toString());
  console.log("Multiply by 2:", num.times(2).toString());
}
