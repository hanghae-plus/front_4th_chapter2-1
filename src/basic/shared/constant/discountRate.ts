import { PRODUCT_ID } from './productId';

const DISCOUNT_RATE = {
  [PRODUCT_ID.P1]: 0.1,
  [PRODUCT_ID.P2]: 0.15,
  [PRODUCT_ID.P3]: 0.2,
  [PRODUCT_ID.P4]: 0.05,
  [PRODUCT_ID.P5]: 0.25,
} as const;

export { DISCOUNT_RATE };
