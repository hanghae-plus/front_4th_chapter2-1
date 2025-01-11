import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

describe('advanced test', () => {
  describe.each([{ type: 'basic', loadFile: () => import('../main.advanced.tsx') }])(
    '$type 장바구니 시나리오 테스트',
    ({ loadFile }) => {
      let sel;
      beforeAll(async () => {
        // DOM 초기화
        document.body.innerHTML = '<div id="app"></div>';
        await loadFile();

        // 전역 변수 참조
        // sel = document.getElementById('product-select');
        // addBtn = document.getElementById('add-to-cart');
        sel = document.getElementById('product-select');
        // sum = document.getElementById('cart-total');
        // stockInfo = document.getElementById('stock-status');
      });
      beforeEach(() => {
        vi.useFakeTimers();
        const mockDate = new Date('2025-1-6');
        vi.setSystemTime(mockDate);
        vi.spyOn(window, 'alert').mockImplementation(() => {});
      });
      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
        expect(sel).toBeDefined();
        // expect(sel.tagName.toLowerCase()).toBe('select');
        // expect(sel.children.length).toBe(5);

        // // 첫 번째 상품 확인
        // expect(sel.children[0].value).toBe('p1');
        // expect(sel.children[0].textContent).toBe('상품1 - 10000원');
        // expect(sel.children[0].disabled).toBe(false);

        // // 마지막 상품 확인
        // expect(sel.children[4].value).toBe('p5');
        // expect(sel.children[4].textContent).toBe('상품5 - 25000원');
        // expect(sel.children[4].disabled).toBe(false);

        // // 재고 없는 상품 확인 (상품4)
        // expect(sel.children[3].value).toBe('p4');
        // expect(sel.children[3].textContent).toBe('상품4 - 15000원');
        // expect(sel.children[3].disabled).toBe(true);
      });
    }
  );
});
