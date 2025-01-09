const NO_STOCK = '재고가 부족합니다.';

const DAYS = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
} as const;
const LOYALTY_DAY = DAYS['화'];
const LOYALTY_POINTS_RATE = 1_000;

const THRESHOLD = {
  QUANTITY: 10,
  BULK: 30,
  STOCK: 5,
} as const;

const DISCOUNT_RATES = {
  BULK: 0.25,
  LOYALTY_DAY: 0.1,
  PRODUCT: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
  RANDOM: 0.3,
} as const;

const LIGHTNING_SALE = {
  INTERVAL: 30_000,
  DELAY: 10_000,
  RATE: 0.8,
} as const;

const SUGGESTION = {
  INTERVAL: 60_000,
  DELAY: 20_000,
  RATE: 0.95,
} as const;

export {
  DISCOUNT_RATES,
  LIGHTNING_SALE,
  LOYALTY_DAY,
  LOYALTY_POINTS_RATE,
  NO_STOCK,
  SUGGESTION,
  THRESHOLD,
};
