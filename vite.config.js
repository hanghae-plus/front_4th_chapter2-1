import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const projectConfig = {
    basic: {
      outDir: "dist/basic",
      openFile: "/index.basic.html",
    },
    advanced: {
      outDir: "dist/advance",
      openFile: "/index.advanced.html",
    },
  };

  // 현재 모드에 맞는 설정 불러오기
  const config = projectConfig[mode] || projectConfig.basic;

  return {
    build: {
      outDir: config.outDir,
    },
    server: {
      open: config.openFile,
    },
    test: {
      environment: "jsdom",
      globals: true,
    },
  };
});
