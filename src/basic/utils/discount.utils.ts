import {
  ITEM_QUANTITY_DISCOUNT_RATES,
  DAY_DISCOUNT_RATES,
  BULK_DISCOUNT_RATES,
  ITEM_QUANTITY_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_THRESHOLD,
} from '../constants/discount.constant';
export const getItemQuantityDiscountRate = (productId: string, quantity: number): number => {
  if (quantity >= ITEM_QUANTITY_DISCOUNT_THRESHOLD) {
    return ITEM_QUANTITY_DISCOUNT_RATES[productId] || 0;
  }

  return 0;
};

export const getBulkDiscountRate = (cartTotalQuantity: number): number => {
  if (cartTotalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    return BULK_DISCOUNT_RATES;
  }

  return 0;
};

export const getDayDiscountRate = (): number => {
  const today = new Date().getDay();

  return DAY_DISCOUNT_RATES[today];
};
