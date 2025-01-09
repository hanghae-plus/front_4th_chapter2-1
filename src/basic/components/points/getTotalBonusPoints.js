const LOYALTY_POINTS_RATE = 1_000; // 1000원당 1포인트 적립

/**
 * 총 포인트 계산
 * @param {*} totalAmount - 총 금액
 * @returns {number} 총 포인트
 */
export const getTotalBonusPoints = totalAmount =>
  Math.floor(totalAmount / LOYALTY_POINTS_RATE);
