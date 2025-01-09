import { DISCOUNT } from './config.js';

export const getProductDiscount = (productId, condition) => {
  if (!condition) {
    return DISCOUNT.NONE;
  }

  const discountRate = {
    p1: DISCOUNT.TEN_PERCENT,
    p2: DISCOUNT.FIFTEEN_PERCENT,
    p3: DISCOUNT.TWENTY_PERCENT,
    p4: DISCOUNT.FIVE_PERCENT,
    p5: DISCOUNT.QUARTER,
  };

  return discountRate[productId] ?? DISCOUNT.NONE;
};
