import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { CartPage } from '../pages/CartPage';

describe('advanced test', () => {
  beforeEach(() => {
    render(<CartPage />);
  });

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
    const sel = screen.getByRole('combobox');
    expect(sel).toBeDefined();
    expect(sel.tagName.toLowerCase()).toBe('select');
    expect(sel.children.length).toBe(5);

    // 첫 번째 상품 확인
    expect(sel.children[0]).toHaveValue('p1');
    expect(sel.children[0]).toHaveTextContent('상품1 - 10000원');
    expect(sel.children[0]).not.toBeDisabled();

    // 마지막 상품 확인
    expect(sel.children[4]).toHaveValue('p5');
    expect(sel.children[4]).toHaveTextContent('상품5 - 25000원');
    expect(sel.children[4]).not.toBeDisabled();

    // 재고 없는 상품 확인 (상품4)
    expect(sel.children[3]).toHaveValue('p4');
    expect(sel.children[3]).toHaveTextContent('상품4 - 15000원');
    expect(sel.children[3]).toBeDisabled();
  });
});
