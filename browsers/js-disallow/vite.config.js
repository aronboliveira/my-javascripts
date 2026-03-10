import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
