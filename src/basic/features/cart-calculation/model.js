export const formatDiscountRate = (discountRate) =>
  `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
export const formatTotalPrice = (totalAmount) =>
  `총액: ${Math.round(totalAmount)}원`;
