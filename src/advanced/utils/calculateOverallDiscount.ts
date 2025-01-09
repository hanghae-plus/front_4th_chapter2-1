import { DISCOUNT_RATES, LOYALTY_DAY, THRESHOLD } from '../constants';

/**
 * 할인율을 계산하는 함수
 */
export function calculateOverallDiscount(
  totalAmount: number,
  preDiscountTotal: number,
  itemCount: number,
) {
  let overallDiscountRate = 0;
  let discountedTotalAmount = totalAmount;

  const bulkDiscount = totalAmount * DISCOUNT_RATES.BULK;
  const itemDiscount = preDiscountTotal - totalAmount;

  if (itemCount >= THRESHOLD.BULK && bulkDiscount > itemDiscount) {
    discountedTotalAmount = preDiscountTotal * (1 - DISCOUNT_RATES.BULK);
    overallDiscountRate = DISCOUNT_RATES.BULK;
  } else {
    overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
  }

  if (new Date().getDay() === LOYALTY_DAY) {
    discountedTotalAmount *= 1 - DISCOUNT_RATES.LOYALTY_DAY;
    overallDiscountRate = Math.max(overallDiscountRate, DISCOUNT_RATES.LOYALTY_DAY);
  }

  return { overallDiscountRate, discountedTotalAmount };
}
