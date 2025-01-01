export interface ErrorDetails extends Record<string, unknown> {
  context?: string;
  expected?: unknown;
  received?: unknown;
}
