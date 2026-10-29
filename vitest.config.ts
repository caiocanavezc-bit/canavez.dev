import mdx from "@mdx-js/rollup";
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [mdx()],
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
