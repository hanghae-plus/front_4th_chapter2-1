import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../component/App'; // React 컴포넌트

describe('advanced test', () => {
  describe.each([{ type: 'basic', Component: App }])(
    '$type 장바구니 시나리오 테스트',
    ({ Component }) => {
      beforeEach(() => {
        vi.useFakeTimers();
        const mockDate = new Date('2025-1-6');
        vi.setSystemTime(mockDate);
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

        expect(screen.getByTestId('cart-total-amount')).toHaveTextContent('총액: 0원');
        expect(screen.getByTestId('loyalty-points')).toHaveTextContent('(포인트: 0)');

        expect(screen.getByTestId('stock-status')).toBeInTheDocument();
      });

      it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
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

        expect(screen.getByTestId('cart-items')).toHaveTextContent('상품1 - 10000원 x 1');
      });

      it('상품을 장바구니에서 삭제할 수 있는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });
        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        const removeButton = screen.getByTestId('cart-item-remove-p1');

        fireEvent.click(removeButton);

        expect(screen.queryByTestId('cart-item-p1')).not.toBeInTheDocument();
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

      it('상품을 장바구니에 추가하면 총액과 포인트가 갱신된다', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        // 총액과 포인트를 개별적으로 확인
        expect(screen.getByTestId('cart-total-amount')).toHaveTextContent('총액: 10000원');
        expect(screen.getByTestId('loyalty-points')).toHaveTextContent('(포인트: 10)');
      });

      it('할인이 올바르게 적용되는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        for (let i = 0; i < 10; i++) {
          fireEvent.click(addButton);
        }

        expect(screen.getByText(/10.0% 할인/)).toBeInTheDocument();
      });

      it('화요일 할인이 적용되는지 확인', () => {
        const mockDate = new Date('2024-10-15'); // 화요일로 수정
        vi.useFakeTimers();
        vi.setSystemTime(mockDate);

        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        expect(screen.getByText(/10.0% 할인/)).toBeInTheDocument();
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

        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 없습니다.'));
        expect(screen.getByText(/상품5.*x 10/)).toBeInTheDocument();
        expect(screen.getByText(/상품5: 품절/)).toBeInTheDocument();
      });

      it('포인트가 올바르게 계산되는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        fireEvent.change(select, { target: { value: 'p2' } });
        fireEvent.click(addButton);

        // DOM 내용을 콘솔에 출력하여 실제 텍스트 확인
        screen.debug();

        // 더 유연한 텍스트 매칭을 위해 정규식 사용
        expect(screen.getByText(/포인트.*20/)).toBeInTheDocument();
      });

      it('재고가 부족한 경우 추가되지 않는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        // p4 상품 선택 (재고 없음)
        fireEvent.change(select, { target: { value: 'p4' } });
        fireEvent.click(addButton);

        expect(screen.queryByTestId('cart-item-p4')).not.toBeInTheDocument();
        expect(screen.getByText(/상품4: 품절/)).toBeInTheDocument();
      });

      it('번개세일 기능이 30% 확률로 발생하는지 확인', () => {
        // Math.random 모킹
        const mockRandom = vi.spyOn(Math, 'random');

        describe('성공 케이스 (30% 확률에 성공)', () => {
          beforeEach(() => {
            vi.clearAllMocks();
            mockRandom.mockReturnValue(0.2);
          });

          it('번개세일 알림이 표시됨', () => {
            vi.advanceTimersByTime(30000);
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('번개 세일'));
          });
        });

        describe('실패 케이스 (30% 확률에 실패)', () => {
          beforeEach(() => {
            vi.clearAllMocks();
            mockRandom.mockReturnValue(0.4);
          });

          it('번개세일 알림이 표시되지 않음', () => {
            vi.advanceTimersByTime(30000);
            expect(window.alert).not.toHaveBeenCalled();
          });
        });

        // Math.random 모킹 해제
        mockRandom.mockRestore();
      });

      it('추천 상품 알림이 표시되는지 확인', () => {
        const select = screen.getByRole('combobox');
        const addButton = screen.getByRole('button', { name: /추가/i });

        // 상품1 선택
        fireEvent.change(select, { target: { value: 'p1' } });
        fireEvent.click(addButton);

        // 1분 후 시간 진행
        vi.advanceTimersByTime(60000);

        // 추천 알림이 표시되었는지 확인 (상품1이 아닌 다른 상품이 추천됨)
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringMatching(/상품[2-5] 은\(는\) 어떠세요\? 지금 구매하시면 5% 할인!/),
        );
      });
    },
  );
});
