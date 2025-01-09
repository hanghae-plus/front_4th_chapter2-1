import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.test.{js,ts,jsx,tsx}'],
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
