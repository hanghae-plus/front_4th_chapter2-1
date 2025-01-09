// 고정 할인율
export const DISCOUNTS = {
  RATE_20: 0.2,
  RATE_10: 0.1,
  RATE_15: 0.15,
  RATE_25: 0.25,
  RATE_5: 0.05,
} as const;

// 대량 구매
export const BULK_DISCOUNT = {
  THRESHOLD: 30,
  RATE: 0.25,
} as const;

// 특별 할인
export const SPETIAL_DISCOUNT = {
  LUCKY: 0.8,
  SUGGESTED: 0.95,
} as const;

export const WEEKDAY = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;
