import { createStore } from "./createStore";

export const cartStore = (() => {
  const initialState = {
    items: [], // 장바구니 아이템 목록
    totalAmount: 0, // 총 금액
    itemCount: 0, // 총 상품 개수
    lastSelected: null, // 마지막 선택 상품
    bonusPoints: 0, // 적립 포인트
    discountRate: 0, // 할인율
    subtotal: 0, // 할인 전 금액
  };
  return createStore(initialState);
})();
