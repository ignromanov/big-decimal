import { BigDecimalConfiguration } from "@/core/config";
import { BigDecimalError } from "@/core/errors";

/**
 * Module for handling validation errors based on configuration
 */
export const errorHandlingModule = {
  /**
   * Handles validation errors based on STRICT_MODE configuration
   * In strict mode: throws the original error
   * In relaxed mode: returns fallback value or throws if no fallback provided
   *
   * @param error - The caught error
   * @param fallback - Optional fallback value or function
   * @throws {BigDecimalError} In strict mode or if no fallback provided
   */
  handleValidationError<T>(error: unknown, fallback?: T | (() => T)): T {
    // Always throw non-BigDecimalErrors
    if (!(error instanceof BigDecimalError)) {
      throw error;
    }

    const config = BigDecimalConfiguration.get();

    // In strict mode, always throw
    if (config.STRICT_MODE) {
      throw error;
    }

    // In relaxed mode, use fallback if provided
    if (fallback !== undefined) {
      return typeof fallback === "function"
        ? (fallback as () => T)()
        : fallback;
    }

    // No fallback available, throw even in relaxed mode
    throw error;
  },
} as const;
