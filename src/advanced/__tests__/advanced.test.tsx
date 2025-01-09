import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

describe('장바구니 시나리오 테스트', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
    const select = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(5);

    // 첫 번째 상품 확인
    expect(select.children[0].value).toBe('p1');
    expect(select.children[0].textContent).toBe('상품1 - 10000원');
    expect(select.children[0].disabled).toBe(false);

    // 재고 없는 상품 확인 (상품4)
    expect(select.children[3].value).toBe('p4');
    expect(select.children[3].textContent).toBe('상품4 - 15000원');
    expect(select.children[3].disabled).toBe(true);
  });

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    expect(screen.getByText('장바구니')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByRole('button', { name: '추가' })).toBeDefined();
    expect(document.getElementById('cart-items')).toBeDefined();
    expect(screen.getByText(/총액: 0원/)).toBeDefined();
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.click(addButton);

    const cartItem = await screen.findByText(/상품1 - 10000원 x 1/i);
    expect(cartItem).toBeInTheDocument();
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.click(addButton);

    const increaseButton = await screen.findByRole('button', { name: '+' });
    fireEvent.click(increaseButton);

    const cartItem = screen.getByText(/상품1 - 10000원 x 2/i);
    expect(cartItem).toBeInTheDocument();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.click(addButton);

    const removeButton = await screen.findByRole('button', { name: '삭제' });
    fireEvent.click(removeButton);

    const cartItems = document.getElementById('cart-items');
    expect(cartItems?.children.length).toBe(0);
  });

  it('총액이 올바르게 계산되는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    const totalElement = screen.getByText(/총액:/);
    expect(totalElement).toHaveTextContent('20000원');
  });

  it('재고가 부족한 경우 알림이 표시되는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p4' } }); // 재고 없는 상품
    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다'));
  });
});
