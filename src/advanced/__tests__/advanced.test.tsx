import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('React 기반 장바구니 시나리오 테스트', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', async () => {
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.children.length).toBe(5);

    // 첫 번째 상품 확인
    expect(select.children[0]).toHaveValue('p1');
    expect(select.children[0]).toHaveTextContent('상품1 - 10000원');
    expect(select.children[0]).not.toBeDisabled();

    // 재고 없는 상품 확인 (상품4)
    expect(select.children[3]).toHaveValue('p4');
    expect(select.children[3]).toHaveTextContent('상품4 - 15000원');
    expect(select.children[3]).toBeDisabled();
  });

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('장바구니');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('추가')).toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent('총액: 0원(포인트: 0)');
    expect(screen.getByTestId('stock-status')).toBeInTheDocument();
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', async () => {
    const sel = screen.getByRole('combobox');
    const addButton = screen.getByTestId('add-to-cart-button');

    fireEvent.change(sel, { target: { value: 'p1' } });
    fireEvent.click(addButton);

    const cartItem = screen.getByText(/상품1 - 10000원 x 1/);
    expect(cartItem).toBeInTheDocument();
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', async () => {
    const increaseBtn = screen.getByTestId('quantity-increase');
    fireEvent.click(increaseBtn);

    const cartItem = screen.getByText(/상품1 - 10000원 x 2/);
    expect(cartItem).toBeInTheDocument();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    const addButton = screen.getByTestId('add-to-cart-button');

    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(addButton);

    const removeBtn = screen.getByTestId('remove-item');
    fireEvent.click(removeBtn);
    expect(screen.queryByText(/상품1 - 10000원 x 1/)).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-total')).toHaveTextContent('총액: 0원(포인트: 0)');
  });

  it('총액과 할인이 올바르게 계산되는지 확인', async () => {
    const sel = screen.getByRole('combobox');
    const addBtn = screen.getByText('추가');

    fireEvent.change(sel, { target: { value: 'p1' } });
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);

    const isTuesday = new Date().getDay() === 2;
    const expectedText = isTuesday
      ? '총액: 18000원(10.0% 할인 적용)(포인트: 18)'
      : '총액: 20000원(포인트: 20)';
    expect(screen.getByTestId('cart-total')).toHaveTextContent(expectedText);
  });

  it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const select = screen.getByRole('combobox');
    const addButton = screen.getByTestId('add-to-cart-button');

    fireEvent.change(select, { target: { value: 'p4' } });
    fireEvent.click(addButton);

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다.'));
    const disabledOption = screen.getByRole('option', { name: /상품4 - 15000원/ });
    expect(disabledOption).toBeDisabled();

    // Mock 복원
    alertMock.mockRestore();
  });
});
