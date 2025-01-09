import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App';

describe('ddvanced test', () => {
  beforeEach(() => {
    render(<App />);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('초기 상태: 상품 목록이 올바르게 렌더링되는지 확인', () => {});

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {});

  it('상품을 장바구니에 추가할 수 있는지 확인', () => {
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByText(/상품1 - 10000원 x 1/)).toBeInTheDocument();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {});

  it('총액이 올바르게 계산되는지 확인', () => {});

  it('상품 수량에 따라 할인율이 올바르게 적용되는지 확인', () => {});

  it('상품 수량에 따라 추가 할인율이 올바르게 적용되는지 확인', () => {});

  it('30개 이상 구매 시 전체 25% 할인 적용', () => {});

  it('번개세일 기능이 정상적으로 동작하는지 확인', () => {
    // 일부러 랜덤이 가득한 기능을 넣어서 테스트 하기를 어렵게 만들었습니다. 이런 코드는 어떻게 하면 좋을지 한번 고민해보세요!
  });

  it('추천 상품 알림이 표시되는지 확인', () => {
    // 일부러 랜덤이 가득한 기능을 넣어서 테스트 하기를 어렵게 만들었습니다. 이런 코드는 어떻게 하면 좋을지 한번 고민해보세요!
  });

  it('화요일 특별할인이 적용되는지 확인', () => {});

  it('재고가 부족한 경우 추가되지 않는지 확인', () => {});

  it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {});
});
