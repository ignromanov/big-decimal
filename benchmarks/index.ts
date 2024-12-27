import Benchmark from "benchmark";
import { BD } from "../src/index.js";
import { writeFileSync } from "fs";

const suite = new Benchmark.Suite();

// Test data with different scales and magnitudes
const numbers = [
  "0.1",
  "1.23456789",
  "9999999.99999999",
  "-123456.789",
  "1e-10",
  "1e+20",
].map((n) => BD.from(n));

const largeNumbers = [
  "12345678901234567890.1234567890",
  "-98765432109876543210.9876543210",
].map((n) => BD.from(n));

const smallNumbers = ["0.0000000001", "0.0000000099"].map((n) => BD.from(n));

// Results storage
const results: Array<{
  name: string;
  hz: number;
  rme: number;
  samples: number;
  category: string;
}> = [];

// Benchmark categories
const categories = {
  standard: [
    [
      "Standard test (0.1 + 0.2) * 0.2",
      () => BD.from("0.1").plus("0.2").times("0.2").toString(),
    ],
  ],
  // creation: [
  //   ["Creation from string (small)", () => BD.from("123.456789")],
  //   [
  //     "Creation from string (large)",
  //     () => BD.from("12345678901234567890.1234567890"),
  //   ],
  //   ["Creation from number", () => BD.from(123.456789)],
  // ],
  // arithmetic: [
  //   ["Addition (normal)", () => numbers[0].plus(numbers[1])],
  //   ["Addition (large)", () => largeNumbers[0].plus(largeNumbers[1])],
  //   ["Subtraction (normal)", () => numbers[1].minus(numbers[2])],
  //   ["Subtraction (large)", () => largeNumbers[0].minus(largeNumbers[1])],
  //   ["Multiplication (normal)", () => numbers[2].times(numbers[3])],
  //   ["Multiplication (large)", () => largeNumbers[0].times(numbers[1])],
  //   ["Division (normal)", () => numbers[3].div(numbers[4], 10)],
  //   ["Division (large)", () => largeNumbers[0].div(numbers[2], 10)],
  // ],
  // conversion: [
  //   ["toString() (normal)", () => numbers[4].toString()],
  //   ["toString() (large)", () => largeNumbers[0].toString()],
  // ],
  // comparison: [
  //   ["Comparison (normal)", () => numbers[0].compareTo(numbers[1])],
  //   ["Comparison (large)", () => largeNumbers[0].compareTo(largeNumbers[1])],
  // ],
  // other: [
  //   ["Round (normal)", () => numbers[1].round(2)],
  //   ["Round (large)", () => largeNumbers[0].round(5)],
  //   ["Absolute value", () => numbers[3].abs()],
  //   ["Negate", () => numbers[2].negate()],
  //   // ["Power", () => numbers[0].pow(3)],
  //   ["Square root", () => numbers[1].sqrt(10)],
  // ],
};

// Add benchmarks by category
Object.entries(categories).forEach(([category, tests]) => {
  tests.forEach(([name, fn]) => {
    suite.add(name as string, fn as Function, {
      onComplete: (event: any) => {
        results.push({
          name: event.target.name,
          hz: event.target.hz,
          rme: event.target.stats.rme,
          samples: event.target.stats.sample.length,
          category,
        });
      },
    });
  });
});

// Event listeners with better formatting
suite
  .on("cycle", (event: any) => {
    const target = event.target;
    console.log(
      `${target.name}: ${Math.round(
        target.hz
      ).toLocaleString()} ops/sec ±${target.stats.rme.toFixed(2)}% (${
        target.stats.sample.length
      } runs sampled)`
    );
  })
  .on("complete", function (this: any) {
    console.log("\nResults by category:");

    // Group and sort results by category
    const groupedResults = results.reduce((acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    }, {} as Record<string, typeof results>);

    Object.entries(groupedResults).forEach(([category, categoryResults]) => {
      console.log(`\n${category.toUpperCase()}:`);
      categoryResults
        .sort((a, b) => b.hz - a.hz)
        .forEach((result) => {
          console.log(
            `  ${result.name}: ${Math.round(
              result.hz
            ).toLocaleString()} ops/sec ±${result.rme.toFixed(2)}%`
          );
        });
    });

    // Save results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const resultsJson = JSON.stringify({ timestamp, results }, null, 2);
    writeFileSync(`./benchmarks/results-${timestamp}.json`, resultsJson);
    console.log(`\nResults saved to ./benchmarks/results-${timestamp}.json`);
  })
  // Run with async to prevent blocking
  .run({ async: true });
