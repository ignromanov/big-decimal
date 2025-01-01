/** Interface for formatting operations */
export interface IFormattingModule {
  toString(): string;
  toFixed(dp: number): string;
  round(dp: number): BigDecimal;
  [Symbol.toPrimitive](hint: string): number | string;
  valueOf(): number;
}
