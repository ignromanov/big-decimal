/**
 * Generic type for class constructors
 * @template T The instance type of the class
 */
export type Constructor<T = {}> = new (...args: any[]) => T;
