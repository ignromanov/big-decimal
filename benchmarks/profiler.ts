import { BD } from "../src/index.js";
import { performance } from "perf_hooks";

class Profiler {
  private measurements: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();

  start(label: string) {
    this.startTimes.set(label, performance.now());
  }

  end(label: string) {
    const startTime = this.startTimes.get(label);
    if (startTime === undefined) return;

    const duration = performance.now() - startTime;
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    this.measurements.get(label)!.push(duration);
  }

  getStats(label: string) {
    const times = this.measurements.get(label) || [];
    if (times.length === 0) return null;

    const sum = times.reduce((a, b) => a + b, 0);
    const avg = sum / times.length;
    const sorted = [...times].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return {
      avg,
      median,
      min,
      max,
      samples: times.length,
    };
  }

  printStats() {
    console.log("\nDetailed Performance Profile:");
    console.log("============================");

    for (const [label, times] of this.measurements.entries()) {
      const stats = this.getStats(label)!;
      console.log(`\n${label}:`);
      console.log(`  Average:  ${stats.avg.toFixed(3)} ms`);
      console.log(`  Median:   ${stats.median.toFixed(3)} ms`);
      console.log(`  Min:      ${stats.min.toFixed(3)} ms`);
      console.log(`  Max:      ${stats.max.toFixed(3)} ms`);
      console.log(`  Samples:  ${stats.samples}`);
    }
  }
}

// Create profiler
const profiler = new Profiler();
const ITERATIONS = 10000;

console.log(`Running ${ITERATIONS} iterations for each operation...\n`);

// Profile each operation separately
for (let i = 0; i < ITERATIONS; i++) {
  // Creation
  profiler.start("Creation of 0.1");
  const a = BD.from("0.1");
  profiler.end("Creation of 0.1");

  profiler.start("Creation of 0.2");
  const b = BD.from("0.2");
  profiler.end("Creation of 0.2");

  // Addition
  profiler.start("Addition (0.1 + 0.2)");
  const sum = a.plus(b);
  profiler.end("Addition (0.1 + 0.2)");

  // Multiplication
  profiler.start("Multiplication (0.3 * 0.2)");
  const result = sum.times(b);
  profiler.end("Multiplication (0.3 * 0.2)");

  // ToString
  profiler.start("ToString");
  result.toString();
  profiler.end("ToString");

  // Full operation
  profiler.start("Full operation ((0.1 + 0.2) * 0.2)");
  BD.from("0.1").plus(BD.from("0.2")).times(BD.from("0.2")).toString();
  profiler.end("Full operation ((0.1 + 0.2) * 0.2)");
}

// Print results
profiler.printStats();

// Additional breakdown analysis
console.log("\nOperation Breakdown Analysis:");
console.log("===========================");

const fullStats = profiler.getStats("Full operation ((0.1 + 0.2) * 0.2)")!;
const creationStats = profiler.getStats("Creation of 0.1")!;
const additionStats = profiler.getStats("Addition (0.1 + 0.2)")!;
const multiplicationStats = profiler.getStats("Multiplication (0.3 * 0.2)")!;
const toStringStats = profiler.getStats("ToString")!;

const totalTime = fullStats.avg;
const operationsTime =
  creationStats.avg * 3 +
  additionStats.avg +
  multiplicationStats.avg +
  toStringStats.avg;

console.log("\nTime Distribution:");
console.log(`  Total time:        ${totalTime.toFixed(3)} ms (100%)`);
console.log(
  `  Operations time:   ${operationsTime.toFixed(3)} ms (${(
    (operationsTime / totalTime) *
    100
  ).toFixed(1)}%)`
);
console.log(
  `  Overhead:          ${(totalTime - operationsTime).toFixed(3)} ms (${(
    ((totalTime - operationsTime) / totalTime) *
    100
  ).toFixed(1)}%)`
);

console.log("\nBottleneck Analysis:");
const operations = [
  { name: "Number Creation (x3)", time: creationStats.avg * 3 },
  { name: "Addition", time: additionStats.avg },
  { name: "Multiplication", time: multiplicationStats.avg },
  { name: "ToString", time: toStringStats.avg },
];

operations.sort((a, b) => b.time - a.time);

operations.forEach((op) => {
  const percentage = (op.time / operationsTime) * 100;
  console.log(
    `  ${op.name}: ${op.time.toFixed(3)} ms (${percentage.toFixed(1)}%)`
  );
});
