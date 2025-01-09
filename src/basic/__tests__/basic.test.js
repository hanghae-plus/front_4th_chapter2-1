import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

describe('basic test', () => {
  describe.each([
    { type: 'origin', loadFile: () => import('../../main.original.js') },
    { type: 'basic', loadFile: () => import('../main.basic.js') }
  ])('$type 장바구니 시나리오 테스트', ({ loadFile }) => {
    let sel, addBtn, cartDisp, sum, stockInfo;

    beforeAll(async () => {
      // DOM 초기화
      document.body.innerHTML = '<div id="app"></div>';
      await loadFile();
    });

    beforeEach(() => {
      // 전역 변수 참조
      sel = document.getElementById('product-select');
      addBtn = document.getElementById('add-to-cart');
      cartDisp = document.getElementById('cart-items');
      sum = document.getElementById('cart-total');
      stockInfo = document.getElementById('stock-status');
      vi.useRealTimers();
      vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
      expect(sel).toBeDefined();
      expect(sel.tagName.toLowerCase()).toBe('select');
      expect(sel.children.length).toBe(5);

      // 첫 번째 상품 확인
      expect(sel.children[0].value).toBe('p1');
      expect(sel.children[0].textContent).toBe('상품1 - 10000원');
      expect(sel.children[0].disabled).toBe(false);

      // 마지막 상품 확인
      expect(sel.children[4].value).toBe('p5');
      expect(sel.children[4].textContent).toBe('상품5 - 25000원');
      expect(sel.children[4].disabled).toBe(false);

      // 재고 없는 상품 확인 (상품4)
      expect(sel.children[3].value).toBe('p4');
      expect(sel.children[3].textContent).toBe('상품4 - 15000원');
      expect(sel.children[3].disabled).toBe(true);
    });

    it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
      expect(document.querySelector('h1').textContent).toBe('장바구니');
      expect(sel).toBeDefined();
      expect(addBtn).toBeDefined();
      expect(cartDisp).toBeDefined();
      expect(sum.textContent).toContain('총액: 0원(포인트: 0)');
      expect(stockInfo).toBeDefined();
    });

    /**
     *기존 코드에서는 총액을 표시하는 DOM 요소를 항상 새로 선언하고 가져와 최신 상태를 유지하도록 설계되었습니다.
     *하지만 리팩토링 과정에서, DOM 요소를 템플릿 리터럴을 활용한 선언형 방식으로 변경하였고, 전역 상태 관리와 옵저버 패턴을 도입하여 상태 변화에 따라 총액을 자동으로 다시 렌더링하는 구조로 개선했습니다.
     *이로 인해 비동기적으로 상태가 변경될 경우, 테스트 시 DOM 요소를 가져오는 시점에 최신 상태가 반영되지 않아 테스트가 실패하는 문제가 발생했습니다.
     *이를 해결하기 위해, 테스트 코드에서 항상 최신 DOM 요소를 가져오도록 수정하여 문제가 해결되었습니다. -> 이 점을 해결하고 싶은데 이유를 찾지 못했습니다....
     */

    it('상품을 장바구니에 추가할 수 있는지 확인', () => {
      sel.value = 'p1';
      addBtn.click();

      const cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기

      expect(cartDisp.children.length).toBe(1);
      expect(cartDisp.children[0].querySelector('span').textContent).toContain(
        '상품1 - 10000원 x 1'
      );
    });

    it('장바구니에서 상품 수량을 변경할 수 있는지 확인', () => {
      let cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기
      const increaseBtn = cartDisp.querySelector(
        '.quantity-change[data-change="1"]'
      );
      increaseBtn.click();

      cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기

      expect(cartDisp.children[0].querySelector('span').textContent).toContain(
        '상품1 - 10000원 x 2'
      );
    });

    it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {
      sel.value = 'p1';
      addBtn.click();
      let cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기
      const removeBtn = cartDisp.querySelector('.remove-item');
      removeBtn.click();

      cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기
      const sum = document.getElementById('cart-total');

      expect(cartDisp.children.length).toBe(0);
      expect(sum.textContent).toContain('총액: 0원(포인트: 0)');
    });

    it('총액이 올바르게 계산되는지 확인', () => {
      sel.value = 'p1';
      addBtn.click();
      addBtn.click();

      const updatedSum = document.getElementById('cart-total'); // 최신 DOM 가져오기
      expect(updatedSum.textContent).toContain('총액: 20000원(포인트: 20)');

      // expect(sum.textContent).toContain('총액: 20000원(포인트: 20)'); 기존코드
    });

    it('할인이 올바르게 적용되는지 확인', () => {
      sel.value = 'p1';
      for (let i = 0; i < 10; i++) {
        addBtn.click();
      }

      const updatedSum = document.getElementById('cart-total'); // 최신 DOM 가져오기
      expect(updatedSum.textContent).toContain('(10.0% 할인 적용)');
    });

    it('포인트가 올바르게 계산되는지 확인', () => {
      sel.value = 'p2';
      addBtn.click();

      expect(document.getElementById('loyalty-points').textContent).toContain(
        '(포인트: 128)'
      );
    });

    it('번개세일 기능이 정상적으로 동작하는지 확인', () => {
      // 일부러 랜덤이 가득한 기능을 넣어서 테스트 하기를 어렵게 만들었습니다. 이런 코드는 어떻게 하면 좋을지 한번 고민해보세요!
    });

    it('추천 상품 알림이 표시되는지 확인', () => {
      // 일부러 랜덤이 가득한 기능을 넣어서 테스트 하기를 어렵게 만들었습니다. 이런 코드는 어떻게 하면 좋을지 한번 고민해보세요!
    });

    it('화요일 할인이 적용되는지 확인', () => {
      const mockDate = new Date('2024-10-15'); // 화요일
      vi.useFakeTimers();
      vi.setSystemTime(mockDate);
      sel.value = 'p1';
      addBtn.click();
      expect(document.getElementById('cart-total').textContent).toContain(
        '(10.0% 할인 적용)'
      );
    });

    it('재고가 부족한 경우 추가되지 않는지 확인', () => {
      // p4 상품 선택 (재고 없음)
      sel.value = 'p4';
      addBtn.click();

      // p4 상품이 장바구니에 없는지 확인
      const p4InCart = Array.from(cartDisp.children).some(
        (item) => item.id === 'p4'
      );
      expect(p4InCart).toBe(false);
      expect(stockInfo.textContent).toContain('상품4: 품절');
    });

    it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {
      sel.value = 'p5';
      addBtn.click();
      let cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기
      // p5 상품이 장바구니에 추가되었는지 확인
      const p5InCart = Array.from(cartDisp.children).some(
        (item) => item.id === 'p5'
      );
      expect(p5InCart).toBe(true);

      // 수량 증가 버튼 찾기
      const increaseBtn = cartDisp.querySelector(
        '#p5 .quantity-change[data-change="1"]'
      );
      expect(increaseBtn).not.toBeNull();

      // 수량을 10번 증가시키기
      for (let i = 0; i < 10; i++) {
        increaseBtn.click();
      }

      // 11번째 클릭 시 재고 부족 알림이 표시되어야 함
      increaseBtn.click();

      // 재고 부족 알림이 표시되었는지 확인
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('재고가 부족합니다')
      );

      cartDisp = document.getElementById('cart-items'); // 최신 DOM 가져오기

      // 장바구니의 상품 수량이 10개인지 확인
      const itemQuantity = cartDisp.querySelector('#p5 span').textContent;
      expect(itemQuantity).toContain('x 10');

      const stockInfo = document.getElementById('stock-status');
      // 재고 상태 정보에 해당 상품이 재고 부족으로 표시되는지 확인
      expect(stockInfo.textContent).toContain('상품5: 품절');
    });
  });
});
