import { describe, beforeAll, it, expect } from "vitest";

describe('advanced test', () => {

    describe.each([
        { type: 'origin', loadFile: () => import('../../main.original.js'), },
        { type: 'advanced', loadFile: () => import('../main.advanced.tsx'), },
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

        // AI 가 제공한 tsx 테스트 코드 : basic 코드를 재구성한 것이라 테스트 목표는 정상적임
        it('초기 상태: UI 요소들이 올바르게 렌더링되는지 확인', () => {

        });
    });
});