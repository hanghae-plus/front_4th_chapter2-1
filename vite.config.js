import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const projectConfig = {
    basic: {
      outDir: 'dist/basic',
      openFile: './index.basic.html',
      tsconfig: null,
    },
    advanced: {
      outDir: 'dist/advance',
      plugins: [react()],
      openFile: './index.advanced.html',
      // tsconfig: './tsconfig.json',
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
      environment: 'jsdom',
      globals: true,
      emptyOutDir: true,
    },
    plugins: config.plugins,
    resolve: {
      alias: {
        '@': `/src/${mode}`,
      },
    },
    // esbuild: config.tsconfig
    //   ? { tsconfig: config.tsconfig }
    //   : {},
  };
});
