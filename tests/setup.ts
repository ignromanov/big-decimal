import { expect, afterEach } from "vitest";

export const assertEqual = (expected: string, value: any, message?: string) => {
  const valueStr = String(value);
  try {
    expect(valueStr, message).toBe(expected);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertEqual);
    throw error;
  }
};

export const assertException = (fn: Function, expectedError: string) => {
  try {
    expect(() => {
      try {
        fn();
      } catch (error) {
        throw new Error(String(error));
      }
    }).toThrow(expectedError);
  } catch (error) {
    Error.captureStackTrace(error as Error, assertException);
    throw error;
  }
};

afterEach(() => {
  // Cleanup after each test if needed
});
export { assertEqual as eq, assertException as ex };
