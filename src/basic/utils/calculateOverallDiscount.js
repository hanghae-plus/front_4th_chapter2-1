const BULK_DISCOUNT_RATE = 0.25; // 대량 구매 할인율
const BULK_DISCOUNT_THRESHOLD = 30; // 총 구매 수량 30개 이상일 경우 대량 구매 할인
const WEEKLY_DISCOUNT_DAY = 2; // 화요일
const WEEKLY_DISCOUNT_RATE = 0.1; // 요일별 할인율

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

  const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
  const itemDiscount = preDiscountTotal - totalAmount;

  if (itemCount >= BULK_DISCOUNT_THRESHOLD && bulkDiscount > itemDiscount) {
    discountedTotalAmount = preDiscountTotal * (1 - BULK_DISCOUNT_RATE);
    overallDiscountRate = BULK_DISCOUNT_RATE;
  } else {
    overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
  }

  if (new Date().getDay() === WEEKLY_DISCOUNT_DAY) {
    discountedTotalAmount *= 1 - WEEKLY_DISCOUNT_RATE;
    overallDiscountRate = Math.max(overallDiscountRate, WEEKLY_DISCOUNT_RATE);
  }

  return { overallDiscountRate, discountedTotalAmount };
}
