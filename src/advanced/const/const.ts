import { IndividualDiscount } from '../type';

export const CURRENCY = '원';

export const DISC_DAY_OF_THE_WEEK = 2;
export const ITEM_DISC_MIN_QTY = 10;

const DISC_RATES_PER_ITEM: Record<string, number> = Object.freeze({
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
});

export const DISC_RATES: {
  LUCKY_DISC: number;
  ADDITIONAL_DISC: number;
  BULK_DISC: number;
  DAY_OF_THE_WEEK_DISC: number;
  ITEM_DISC: Record<string, number>;
} = Object.freeze({
  LUCKY_DISC: 0.2,
  ADDITIONAL_DISC: 0.05,
  BULK_DISC: 0.25,
  DAY_OF_THE_WEEK_DISC: 0.1,
  ITEM_DISC: DISC_RATES_PER_ITEM,
});

export const DISC_PROB: Record<IndividualDiscount, number> = Object.freeze({
  LUCKY_DISC: 0.3,
  ADDITIONAL_DISC: 1,
});

export const DISC_INITIAL_BUFFERS: Record<IndividualDiscount, number> =
  Object.freeze({
    LUCKY_DISC: 10000,
    ADDITIONAL_DISC: 20000,
  });

export const DISC_INTERVALS: Record<IndividualDiscount, number> = Object.freeze(
  {
    LUCKY_DISC: 30000,
    ADDITIONAL_DISC: 60000,
  },
);
