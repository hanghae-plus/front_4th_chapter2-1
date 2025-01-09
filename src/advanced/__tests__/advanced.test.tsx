import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import App from '../src/app.tsx';

describe('advanced test', () => {
  describe('$type 장바구니 시나리오 테스트', () => {
    beforeEach(() => {
      render(<App />);
      vi.useFakeTimers();
      const mockDate = new Date('2025-1-6');
      vi.setSystemTime(mockDate);
      vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
      cleanup();
    });

    it('', () => {});
  });
});
