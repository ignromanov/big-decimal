import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    // Library build configuration
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, "src/index.ts"),
      // Global variable name when used in browser
      name: "BigDecimal",
      // Output file name without extension
      fileName: "big-decimal",
    },

    // Rollup specific options
    rollupOptions: {
      // No external dependencies
      external: [],
      output: {
        // No global dependencies
        globals: {},
        // Minify internal exports for smaller bundle
        minifyInternalExports: true,
        // Disable code splitting for libraries
        manualChunks: undefined,
      },
    },

    // Use modern JS features for better minification
    target: "esnext",

    // Use Terser for minification
    minify: "terser",

    // Terser minification options
    terserOptions: {
      compress: {
        // Number of compression passes
        passes: 2,
        // Remove unreachable code
        dead_code: true,
        // Remove console.* calls
        drop_console: true,
        // Remove debugger statements
        drop_debugger: true,
      },
      mangle: {
        properties: {
          // Mangle private properties starting with underscore
          regex: /^_/,
        },
      },
      format: {
        // Remove all comments from output
        comments: false,
      },
    },
  },

  // Path aliases configuration
  resolve: {
    alias: {
      // Map '@' to src directory for imports
      "@": resolve(__dirname, "./src"),
    },
  },
});
