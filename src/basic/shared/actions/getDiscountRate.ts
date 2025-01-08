import { DISCOUNT_RATE } from '../constant/discountRate';

const getDiscountRate = (id: keyof typeof DISCOUNT_RATE) => {
  return DISCOUNT_RATE[id];
};

export { getDiscountRate };
