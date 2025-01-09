import { DAY } from './date.constant';

export const ITEM_QUANTITY_DISCOUNT_THRESHOLD = 10;
export const ITEM_QUANTITY_DISCOUNT_RATES = {
  p1: 0.1, // 10%
  p2: 0.15, // 15%
  p3: 0.2, // 20%
  p4: 0.05, // 5%
  p5: 0.25, // 25%
} as const;

export const BULK_DISCOUNT_RATES = 0.25;
export const BULK_DISCOUNT_THRESHOLD = 30;
export const DAY_DISCOUNT_RATES: Record<DAY, number> = {
  [DAY.SUNDAY]: 0,
  [DAY.MONDAY]: 0,
  [DAY.TUESDAY]: 0.1,
  [DAY.WEDNESDAY]: 0,
  [DAY.THURSDAY]: 0,
  [DAY.FRIDAY]: 0,
  [DAY.SATURDAY]: 0,
};
