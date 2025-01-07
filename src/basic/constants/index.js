// 할인율
const BULK_DISCOUNT_RATE = 0.25; // 대량 구매 할인율
const WEEKLY_DISCOUNT_DAY = 2; // 화요일
const WEEKLY_DISCOUNT_RATE = 0.1; // 요일별 할인율
const RANDOM_SALE_RATE = 0.3; // 랜덤 세일 확률
const LIGHTNING_SALE_RATE = 0.8; // 번개세일 할인율
const SUGGESTION_DISCOUNT_RATE = 0.95; // 추천 상품 할인율

// 수량
const BULK_DISCOUNT_THRESHOLD = 30; // 총 구매 수량 30개 이상일 경우 대량 구매 할인
const QUANTITY_THRESHOLD = 10; // 할인 적용 최소 수량
const STOCK_WARNING_THRESHOLD = 5; // 재고 부족 경고 임계값

// 포인트
const LOYALTY_POINTS_RATE = 1_000; // 1000원당 1포인트 적립

// 시간
const LIGHTNING_SALE_INTERVAL = 30_000; // 30초마다 번개세일
const LIGHTNING_SALE_DELAY = 10_000; // 번개세일 초기 지연
const SUGGESTION_INTERVAL = 60_000; // 60초마다 추천 알림
const SUGGESTION_DELAY = 20_000; // 추천 알림 초기 지연

// 재고 부족 메시지
const OUT_OF_STOCK_MESSAGE = '재고가 부족합니다.';

export const CONSTANTS = {
  BULK_DISCOUNT_RATE,
  WEEKLY_DISCOUNT_DAY,
  WEEKLY_DISCOUNT_RATE,
  RANDOM_SALE_RATE,
  LIGHTNING_SALE_RATE,
  SUGGESTION_DISCOUNT_RATE,
  BULK_DISCOUNT_THRESHOLD,
  QUANTITY_THRESHOLD,
  STOCK_WARNING_THRESHOLD,
  LOYALTY_POINTS_RATE,
  LIGHTNING_SALE_INTERVAL,
  LIGHTNING_SALE_DELAY,
  SUGGESTION_INTERVAL,
  SUGGESTION_DELAY,
  OUT_OF_STOCK_MESSAGE,
};
