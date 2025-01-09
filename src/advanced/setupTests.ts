import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 필요한 전역 mocks 설정
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
  };
});
