# BigDecimal

<div align="center">

[![npm version](https://img.shields.io/npm/v/@your-scope/big-decimal.svg)](https://www.npmjs.com/package/@your-scope/big-decimal)
[![npm downloads](https://img.shields.io/npm/dm/@your-scope/big-decimal.svg)](https://www.npmjs.com/package/@your-scope/big-decimal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A high-precision decimal arithmetic library for JavaScript/TypeScript with arbitrary precision and zero dependencies.

[Installation](#installation) •
[Usage](#usage) •
[API](#api) •
[Examples](#examples) •
[Contributing](#contributing)

</div>

## Features

- 🎯 **Precise Calculations**: No floating-point errors
- 🔢 **Arbitrary Precision**: Support for any number of decimal places
- 🛡️ **Type Safety**: Full TypeScript support
- 🪶 **Lightweight**: Zero dependencies
- 🧬 **Immutable**: All operations return new instances
- 🚀 **Modern**: Built for ES2020+ environments
- 📦 **Tree-Shakeable**: Optimized bundle size
- 💪 **Reliable**: Comprehensive test coverage

## Installation

```bash
# npm
npm install @your-scope/big-decimal

# yarn
yarn add @your-scope/big-decimal

# pnpm
pnpm add @your-scope/big-decimal
```

## Usage

```typescript
import { BigDecimal, BD } from "@your-scope/big-decimal";

// Creating instances
const num1 = new BigDecimal("123.456");
const num2 = BD.from("789.012"); // Shorthand syntax
const num3 = BD.fr(100); // Even shorter syntax

// Basic arithmetic
const sum = num1.plus(num2); // 912.468
const diff = num2.minus(num1); // 665.556
const product = num1.times(num2); // 97,407.371472
const quotient = num1.div(num2, 6); // 0.156468 (with 6 decimal places)

// Comparison
num1.lt(num2); // true  (less than)
num1.gt(num2); // false (greater than)
num1.eq(num2); // false (equals)
num1.lte(num2); // true  (less than or equals)
num1.gte(num2); // false (greater than or equals)

// Other operations
const sqrt = num1.sqrt(); // Square root
const pow = num1.pow(2); // Power
const abs = num1.abs(); // Absolute value
const neg = num1.negate(); // Negation

// Formatting
num1.toString(); // "123.456"
num1.toFixed(2); // "123.46" (rounded to 2 decimal places)
```

## API

### Constructor

```typescript
new BigDecimal(value: string | number | bigint | BigDecimal, scale?: number)
```

### Static Methods

- `BigDecimal.from(value, scale?)`: Create new instance
- `BigDecimal.fr(value, scale?)`: Shorthand for from()
- `BigDecimal.isValid(value)`: Check if value is valid
- `BigDecimal.zero`: Get zero instance

### Instance Methods

#### Arithmetic

- `plus(other)`: Addition
- `minus(other)`: Subtraction
- `times(other)`: Multiplication
- `div(other, scale?)`: Division
- `pow(n)`: Power
- `sqrt(scale?)`: Square root
- `negate()`: Change sign
- `abs()`: Absolute value

#### Comparison

- `compareTo(other)`: Compare values (-1, 0, 1)
- `eq(other)`: Equals
- `gt(other)`: Greater than
- `gte(other)`: Greater than or equals
- `lt(other)`: Less than
- `lte(other)`: Less than or equals

#### Utilities

- `isZero()`: Check if value is zero
- `isPositive()`: Check if value is positive
- `isNegative()`: Check if value is negative
- `toString()`: Convert to string
- `toFixed(dp)`: Format with fixed decimal places
- `round(dp)`: Round to decimal places

## Examples

### Financial Calculations

```typescript
const price = BD.fr("99.99");
const quantity = BD.fr("3");
const taxRate = BD.fr("0.20"); // 20% tax

const subtotal = price.times(quantity); // 299.97
const tax = subtotal.times(taxRate); // 59.994
const total = subtotal.plus(tax).round(2); // 359.96
```

### Scientific Calculations

```typescript
const value = BD.fr("2");
const squareRoot = value.sqrt(10); // 1.4142135624
const power = value.pow(3); // 8
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this library helpful, please consider:

- Starring the [GitHub repository](https://github.com/ignromanov/big-decimal)
- Reporting issues
- Contributing to the code
- Sharing the library with others

---

Made with ❤️ by [Ignat Romanov](https://github.com/ignromanov)
