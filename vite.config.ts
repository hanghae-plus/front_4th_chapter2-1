import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@basic": path.resolve(__dirname, "./src/basic"),
      "@advanced": path.resolve(__dirname, "./src/advanced")
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js"
  }
});
