import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
  // TypeScript와 React 파일 지원
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  // 필요한 경우 별도의 빌드 설정
  build: {
    rollupOptions: {
      input: {
        basic: "./index.basic.html",
        advanced: "./index.advanced.html",
      },
    },
  },
});
