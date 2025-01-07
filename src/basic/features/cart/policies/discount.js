export const DISCOUNT_POLICY = {
  BULK_DISCOUNT_RATE: 0.25, // NOTE: 30개 이상 장바구니 할인
  BULK_PURCHASE_THRESHOLD: 30, // NOTE: 30개 이상 장바구니 구매 시
  LIGHTNING_SALE_PROBABILITY: 0.3, // NOTE: 번개세일 확률 30%
  LIGHTNING_SALE_RATE: 0.2, // NOTE: 번개세일 20% 할인
  MIN_QUANTITY_FOR_DISCOUNT: 10, // NOTE: 10개 이상 시 할인
  PRODUCT_DISCOUNT_RATES: {
    // NOTE: 상품 별 할인율
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
  RECOMMENDATION_DISCOUNT_RATE: 0.05, // NOTE: 상품 추천 할인 5%
  WEEKLY_DISCOUNT_RATES: {
    tuesday: 0.1, // NOTE: 매주 화요일 10% 할인
  },
};
