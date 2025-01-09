import { DISCOUNTS } from '../constants';

export const discountService = {
  calculateProductDiscount: (productId: string, quantity: number) => {
    if (quantity >= 10) {
      return DISCOUNTS.PRODUCT_SPECIFIC[productId] || 0;
    }
    return 0;
  },
  calculateFinalDiscount: (itemCount: number, subtotal: number, currentTotal: number) => {
    if (subtotal === 0) return 0;

    let discountRate = (subtotal - currentTotal) / subtotal;

    if (itemCount >= 30) {
      const bulkDiscount = currentTotal * DISCOUNTS.BULK;
      const itemDiscount = subtotal - currentTotal;
      discountRate = bulkDiscount > itemDiscount ? DISCOUNTS.BULK : itemDiscount / subtotal;
    }

    if (new Date().getDay() === 2) {
      discountRate = Math.max(discountRate, DISCOUNTS.TUESDAY);
    }

    return discountRate;
  },
};
