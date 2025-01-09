import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  defineConfig({
    plugins: [react()]
  }),
  defineTestConfig({
    test: {
      include: ['**/*.test.{js,ts,jsx,tsx}'],
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts'
    }
  })
);
