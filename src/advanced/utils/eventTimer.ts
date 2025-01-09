import { TIME_UNIT } from '../constants/timeUnit';
import { useCartStore } from '../stores/cartStore';

// 이벤트 타이머 설정
export function eventTimer() {
  setupFlashSale();
  setupProductSuggestion();
}

// 번개 세일 설정
function setupFlashSale() {
  setTimeout(
    () => {
      setInterval(() => {
        const { productList, updateProductPrice } = useCartStore.getState();
        const luckyItem = productList[Math.floor(Math.random() * productList.length)];

        if (Math.random() < 0.3 && luckyItem.quantity > 0) {
          const discountedPrice = Math.round(luckyItem.price * 0.8);
          updateProductPrice(luckyItem.id, discountedPrice); // zustand 상태 업데이트
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        }
      }, 30 * TIME_UNIT.초);
    },
    Math.random() * 10 * TIME_UNIT.초
  );
}

// 추천 상품 알림 설정
function setupProductSuggestion() {
  setTimeout(
    () => {
      setInterval(() => {
        const { productList, lastSelectedProductId, updateProductPrice } = useCartStore.getState();

        if (lastSelectedProductId) {
          const suggest = productList.find(
            (item) => item.id !== lastSelectedProductId && item.quantity > 0
          );

          if (suggest) {
            const discountedPrice = Math.round(suggest.price * 0.95);
            updateProductPrice(suggest.id, discountedPrice); // zustand 상태 업데이트
            alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          }
        }
      }, 60 * TIME_UNIT.초);
    },
    Math.random() * 20 * TIME_UNIT.초
  );
}
