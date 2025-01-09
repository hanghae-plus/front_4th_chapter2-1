import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../App';

describe('Shopping Cart Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-08'));
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('초기 상태: 상품 목록이 올바르게 렌더링되는지 확인', () => {
    const select = screen.getByRole('combobox');
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

    // 재고 없는 상품 확인
    expect(options[3]).toHaveValue('p4');
    expect(options[3]).toHaveTextContent('상품4 - 15000원');
    expect(options[3]).toBeDisabled();
  });

  it('초기 상태: 기본 UI 요소들이 올바르게 렌더링되는지 확인', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('장바구니');
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
    expect(screen.getByText(/총액: 0원/)).toBeInTheDocument();
    expect(screen.getByText(/포인트: 0/)).toBeInTheDocument();
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', () => {
    // 상품 선택 및 추가
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    // 장바구니 아이템 확인
    expect(screen.getByText(/상품1 - 10000원 x 1/)).toBeInTheDocument();
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', () => {
    // 상품 추가
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    // 수량 증가
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText(/상품1 - 10000원 x 2/)).toBeInTheDocument();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {
    // 상품 추가
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    // 삭제 전에 장바구니에 상품이 있는지 확인
    expect(screen.getByText(/상품1.*x 1/)).toBeInTheDocument();

    // 삭제 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    // 장바구니에서만 삭제되었는지 확인
    expect(screen.queryByText(/상품1.*x 1/)).not.toBeInTheDocument();

    // 총액 확인 - 텍스트를 개별적으로 체크
    const cartTotalDiv = screen.getByText(/총액:/, { exact: false });
    expect(cartTotalDiv).toHaveTextContent('0');
    expect(screen.getByText(/포인트: 0/)).toBeInTheDocument();
  });

  it('총액이 올바르게 계산되는지 확인', () => {
    // 상품 두 번 추가
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByText(/총액: 20000원/)).toBeInTheDocument();
    expect(screen.getByText(/포인트: 20/)).toBeInTheDocument();
  });

  it('할인이 올바르게 적용되는지 확인', () => {
    // 상품 10번 추가
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    Array.from({ length: 10 }).forEach(() => {
      fireEvent.click(screen.getByRole('button', { name: '추가' }));
    });

    expect(screen.getByText(/10.0% 할인 적용/)).toBeInTheDocument();
  });

  it('재고가 부족한 경우 알림이 표시되는지 확인', () => {
    // p5 상품 추가 및 재고 초과 시도
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p5' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    // 수량을 재고(10개) 이상으로 증가시키기
    Array.from({ length: 11 }).forEach(() => {
      fireEvent.click(screen.getByRole('button', { name: '+' }));
    });

    expect(window.alert).toHaveBeenCalledWith('재고가 부족합니다.');
    expect(screen.getByText(/상품5.*x 10/)).toBeInTheDocument();
  });

  it('화요일 할인이 적용되는지 확인', () => {
    vi.setSystemTime(new Date('2024-01-09')); // 화요일로 설정

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByText(/10.0% 할인 적용/)).toBeInTheDocument();
  });
});
