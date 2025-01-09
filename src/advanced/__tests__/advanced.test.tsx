import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../component/App'; // React 컴포넌트

describe('advanced test', () => {
  describe.each([{ type: 'basic', Component: App }])(
    '$type 장바구니 시나리오 테스트',
    ({ Component }) => {
      beforeEach(() => {
        vi.useRealTimers();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        render(<Component />);
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
        expect(screen.getByText('장바구니')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /추가/i })).toBeInTheDocument();
        expect(screen.getByTestId('cart-items')).toBeInTheDocument();
        expect(screen.getByText(/총액: 0원\(포인트: 0\)/)).toBeInTheDocument();
        expect(screen.getByTestId('stock-status')).toBeInTheDocument();
      });

      it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
        const select = screen.getByRole('combobox');
        const options = screen.getAllByRole('option');

        expect(options).toHaveLength(6);
        expect((options[1] as HTMLOptionElement).value).toBe('p1');
        expect((options[1] as HTMLOptionElement).textContent).toBe('상품1 - 10000원');
        expect((options[1] as HTMLOptionElement).disabled).toBe(false);
      });

      it('상품을 장바구니에 추가할 수 있는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        expect(screen.getByText(/상품1 - 10000원 x 1/)).toBeInTheDocument();
      });

      it('상품을 장바구니에서 삭제할 수 있는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });
        const removeButton = screen.getByRole('button', { name: /삭제/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);
        fireEvent.click(removeButton);

        expect(screen.queryByText(/상품1 - 10000원 x 1/)).not.toBeInTheDocument();
      });

      it('장바구니에서 상품 수량을 변경할 수 있는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        const increaseButton = screen.getByTestId('quantity-increase-p1');
        fireEvent.click(increaseButton);

        expect(screen.getByText(/상품1 - 10000원 x 2/)).toBeInTheDocument();
      });

      it('총액이 올바르게 계산되는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        expect(screen.getByText(/총액: 20000원\(포인트: 20\)/)).toBeInTheDocument();
      });

      it('할인이 올바르게 적용되는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        for (let i = 0; i < 10; i++) {
          fireEvent.click(addButton);
        }

        expect(screen.getByText(/10.0% 할인 적용/)).toBeInTheDocument();
      });

      it('화요일 할인이 적용되는지 확인', () => {
        const mockDate = new Date('2024-10-15'); // 화요일
        vi.useFakeTimers();
        vi.setSystemTime(mockDate);

        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        expect(screen.getByText(/10.0% 할인 적용/)).toBeInTheDocument();
      });

      it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p5' } });
        fireEvent.click(addButton);

        const increaseButton = screen.getByTestId('quantity-increase-p5');

        // 수량을 10번 증가
        for (let i = 0; i < 10; i++) {
          fireEvent.click(increaseButton);
        }

        // 11번째 클릭
        fireEvent.click(increaseButton);

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다'));
        expect(screen.getByText(/상품5.*x 10/)).toBeInTheDocument();
        expect(screen.getByText(/상품5: 품절/)).toBeInTheDocument();
      });
    },
  );
});
