import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  build: {
    rollupOptions: {
      input: {
        basic: "./index.basic.html",
        advanced: "./index.advanced.html",
      },
    },
  },
});
