import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    hookTimeout: 15000,
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "html"],
    },
  },
});
