import { BULK_DISCOUNT_RATES, DAY_DISCOUNT_RATES } from '../constants/discount.constant';

// 상품 갯수에 따른 할인율 계산
export function calculateItemDiscount(productId: string, quantity: number): number {
  if (quantity >= 10) {
    return BULK_DISCOUNT_RATES[productId] || 0;
  }

  return 0;
}

export const calculateDiscountRate = (cartTotalQuantity: number): number => {
  if (cartTotalQuantity >= 30) {
    return 0.25;
  }

  return 0;
};

export const calculateDayDiscountRate = (): number => {
  const today = new Date().getDay();

  return DAY_DISCOUNT_RATES[today];
};
