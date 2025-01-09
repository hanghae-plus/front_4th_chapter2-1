import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../App';

describe('Shopping Cart Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockDate = new Date('2024-01-08');
    vi.setSystemTime(mockDate);
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('초기 상태: 상품 목록이 올바르게 렌더링되는지 확인', () => {
    const select = screen.getByRole('combobox');
    expect(select.tagName.toLowerCase()).toBe('select');

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);

    // 첫 번째 상품 확인
    expect(options[0]).toHaveValue('p1');
    expect(options[0]).toHaveTextContent('상품1 - 10000원');
    expect(options[0]).not.toBeDisabled();

    // 마지막 상품 확인
    expect(options[4]).toHaveValue('p5');
    expect(options[4]).toHaveTextContent('상품5 - 25000원');
    expect(options[4]).not.toBeDisabled();

    // 재고 없는 상품 확인 (상품4)
    expect(options[3]).toHaveValue('p4');
    expect(options[3]).toHaveTextContent('상품4 - 15000원');
    expect(options[3]).toBeDisabled();
  });

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('장바구니');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
    expect(screen.getByText(/총액: 0원/)).toBeInTheDocument();
    expect(screen.getByText(/포인트: 0/)).toBeInTheDocument();
    expect(screen.getByText(/품절/)).toBeInTheDocument();
  });
});
