import { describe, beforeAll, it, expect } from "vitest";

describe('advanced test', () => {

    describe.each([
        { type: 'origin', loadFile: () => import('../../main.original.js'), },
        { type: 'advanced', loadFile: () => import('../main.advanced.js'), },
    ])('$type 장바구니 시나리오 테스트', ({ loadFile }) => {
        let sel, addBtn, cartDisp, sum, stockInfo;

        beforeAll(async () => {
            // DOM 초기화
            document.body.innerHTML='<div id="app"></div>';
            await loadFile();
      
            // 전역 변수 참조
            sel=document.getElementById('product-select');
            addBtn=document.getElementById('add-to-cart');
            cartDisp=document.getElementById('cart-items');
            sum=document.getElementById('cart-total');
            stockInfo=document.getElementById('stock-status');
        });

        it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
            expect(document.querySelector('h1').textContent).toBe('장바구니');
            expect(sel).toBeDefined();
            expect(addBtn).toBeDefined();
            expect(cartDisp).toBeDefined();
            expect(sum.textContent).toContain('총액: 0원(포인트: 0)');
            expect(stockInfo).toBeDefined();
        });
    });
});