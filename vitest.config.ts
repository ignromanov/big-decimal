import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.{test,spec}.{js,ts}"],
    watch: true,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.d.ts"],
    },
    setupFiles: ["tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": "/src",
      "~": "/tests",
    },
  },
});
