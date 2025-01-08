export const CONSTANTS = {
  DISCOUNT_DAY: 2, // 화요일
  BULK_DISCOUNT_RATE: 0.25, // 대량 구매 할인 비율
  DAY_DISCOUNT_RATE: 0.1, // 화요일 할인 비율
  BONUS_POINT_DIVISOR: 1000, // 포인트 계산 기준 (총액 / 1000)
  SALE_CHANCE: 0.3, // 번개 세일 발생 확률
  SALE_DISCOUNT: 0.2, // 번개 세일 할인 비율
  SUGGEST_DISCOUNT: 0.05, // 추천 상품 할인 비율
  LOW_STOCK_THRESHOLD: 5, // 재고 부족 기준
};

export const initialProductList = [
  {id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  {id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  {id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  {id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  {id: 'p5', name: '상품5', price: 25000, quantity: 10 }
];