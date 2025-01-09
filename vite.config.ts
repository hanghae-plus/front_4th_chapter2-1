import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js', './src/advanced/setupTests.ts'],
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/basic/__tests__/**/*.{test,spec}.{js,jsx}',
      'src/advanced/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  build: {
    rollupOptions: {
      input: {
        basic: './index.basic.html',
        advanced: './index.advanced.html',
      },
    },
  },
});
