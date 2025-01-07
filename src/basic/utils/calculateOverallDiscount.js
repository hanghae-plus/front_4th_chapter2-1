import { CONSTANTS } from '../constants';

/**
 * 할인율을 계산하는 함수
 * @param {*} totalAmount - 할인 적용 총액
 * @param {*} preDiscountTotal - 할인 적용 전 총액
 * @param {*} itemCount - 총 구매 수량
 * @returns {Object}
 * @property {number} overallDiscountRate - 총 할인율
 * @property {number} discountedTotalAmount - 할인 적용 총액
 */
export function calculateOverallDiscount(
  totalAmount,
  preDiscountTotal,
  itemCount,
) {
  let overallDiscountRate = 0;
  let discountedTotalAmount = totalAmount;

  const bulkDiscount = totalAmount * CONSTANTS.BULK_DISCOUNT_RATE;
  const itemDiscount = preDiscountTotal - totalAmount;

  if (
    itemCount >= CONSTANTS.BULK_DISCOUNT_THRESHOLD &&
    bulkDiscount > itemDiscount
  ) {
    discountedTotalAmount =
      preDiscountTotal * (1 - CONSTANTS.BULK_DISCOUNT_RATE);
    overallDiscountRate = CONSTANTS.BULK_DISCOUNT_RATE;
  } else {
    overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
  }

  if (new Date().getDay() === CONSTANTS.WEEKLY_DISCOUNT_DAY) {
    discountedTotalAmount *= 1 - CONSTANTS.WEEKLY_DISCOUNT_RATE;
    overallDiscountRate = Math.max(
      overallDiscountRate,
      CONSTANTS.WEEKLY_DISCOUNT_RATE,
    );
  }

  return { overallDiscountRate, discountedTotalAmount };
}
