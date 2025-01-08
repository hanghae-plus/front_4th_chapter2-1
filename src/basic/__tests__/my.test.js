import { describe, expect, it, vi } from 'vitest';
import { getToday } from '../shared/util/date/getToday';

describe('my test', () => {
  it('my test', () => {
    expect(1).toBe(1);
  });

  it('get today 요일', () => {
    vi.setSystemTime(new Date('2025-1-8'));
    const today = getToday();
    expect(today).toBe(8);
  });
});
