import { state } from "../config/constants";
import { updatePickProduct } from "../product/product";

/**
 * 프로모션 설정 함수
 * - 번개 세일: 랜덤한 상품에 일정 확률로 할인 적용
 * - 추천 상품 세일: 이전 선택 상품 기반으로 추천 상품 할인
 */
export function setupPromotions() {
  // 번개 세일 설정
  setTimeout(function () {
    setInterval(() => {
      const luckyItem = state.productList[Math.floor(Math.random() * state.productList.length)];
      if (Math.random() < state.constants.SALE_CHANCE && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - state.constants.SALE_DISCOUNT));
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updatePickProduct(); // 상품 선택 옵션 업데이트
      }
    }, 30000);
  }, Math.random() * 10000);
  
  // 추천 상품 세일 설정
  setTimeout(function () {
    setInterval(() => {
      if (state.lastPickProduct) {
        const recommendedItem = state.productList.find((item) => 
          item.id !== state.lastPickProduct && item.quantity > 0
        );
        if (recommendedItem) {
          recommendedItem.price = Math.floor(recommendedItem.price * (1 - state.constants.SUGGEST_DISCOUNT));
          alert(`${recommendedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          updatePickProduct(); // 상품 선택 옵션 업데이트
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

/**
 * 상품별 할인율 반환
 */
export function getQuantityDiscount(productId) {
  const discountRates = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };
  return discountRates[productId] || 0; // 할인율 반환
}

/**
 * 총액 및 할인 메시지 표시
 */
export function displayTotal(dayDiscountApplied, bulkDiscountApplied) {
  let baseText = `총액: ${state.totalAmount}원`;
  let pointsDisplay = `(포인트: ${state.bonusPoints})`;

  state.totalDisplay.textContent = baseText; // 총액 표시
  
  // 포인트 표시 추가
  const pointsTag = document.createElement("span");
  pointsTag.id = "loyalty-points";
  pointsTag.className = "text-blue-500 ml-2";
  pointsTag.textContent = pointsDisplay;
  state.totalDisplay.appendChild(pointsTag);

  // 할인 적용 메시지  
  let discountMessage = "";
  if (dayDiscountApplied) discountMessage += "(10.0% 할인 적용)";
  if (bulkDiscountApplied) discountMessage += "(대량 구매 할인 적용)";

  if (discountMessage) {
    const discountTag = document.createElement("span");

    discountTag.className = "text-green-500 ml-2";
    discountTag.textContent = discountMessage;
    state.totalDisplay.appendChild(discountTag);
  }
}