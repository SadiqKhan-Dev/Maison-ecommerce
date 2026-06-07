import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "dist", "tests/e2e/**"],
    reporters: ["default"],
    coverage: {
      provider: "v8",
      include: ["lib/**", "app/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "**/.next/**",
        "**/out/**",
        "**/coverage/**",
        "**/*.config.*",
        "**/next-env.d.ts",
      ],
    },
  },
});
