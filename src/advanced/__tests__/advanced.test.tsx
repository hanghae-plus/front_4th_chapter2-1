import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import Main from '../Main';
import { CartStoreProvider } from '../stores/CartStore';

describe('advanced test', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderApp = () =>
    render(
      <CartStoreProvider>
        <Main />
      </CartStoreProvider>
    );

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
    renderApp();

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    const options = screen.getAllByRole('option') as HTMLOptionElement[];

    expect(select).toBeDefined();
    expect(options.length).toBe(5);

    expect(options[0].value).toBe('p1');
    expect(options[0].textContent).toBe('상품1 - 10000원');
    expect(options[0].disabled).toBe(false);

    expect(options[3].value).toBe('p4');
    expect(options[3].textContent).toBe('상품4 - 15000원');
    expect(options[3].disabled).toBe(true);
  });

  it('초기 상태: 컴포넌트가 올바르게 렌더링되었는지 확인', () => {
    renderApp();

    expect(screen.getByText('장바구니')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByText('추가')).toBeDefined();
    expect(screen.getByText('총액: 0원')).toBeDefined();
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', () => {
    renderApp();

    const select = screen.getByRole('combobox');
    const addButton = screen.getByText('추가');

    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/상품1 - 10000원 x 1/)).toBeDefined();
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', () => {
    renderApp();

    const select = screen.getByRole('combobox');
    const addButton = screen.getByText('추가');

    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(addButton);

    const increaseButton = screen.getByText('+');

    fireEvent.click(increaseButton);

    expect(screen.getByText(/상품1 - 10000원 x 2/)).toBeDefined();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {
    renderApp();

    const select = screen.getByRole('combobox');
    const addButton = screen.getByText('추가');

    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(addButton);

    const removeButton = screen.getByText('삭제');

    fireEvent.click(removeButton);

    expect(screen.getByText('총액: 0원')).toBeDefined();
  });

  it('총액이 올바르게 계산되는지 확인', () => {
    renderApp();

    const select = screen.getByRole('combobox');
    const addButton = screen.getByText('추가');

    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getByText('총액: 20000원')).toBeDefined();
  });

  it('화요일 할인이 적용되는지 확인', () => {
    const mockDate = new Date('2025-01-14'); // 화요일

    vi.useFakeTimers();
    vi.setSystemTime(mockDate);

    renderApp();

    const select = screen.getByRole('combobox');
    const addButton = screen.getByText('추가');

    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/10.0% 할인 적용/)).toBeDefined();
  });
});
