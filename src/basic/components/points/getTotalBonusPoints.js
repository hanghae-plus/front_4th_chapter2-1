import { CONSTANTS } from '../../constants';

/**
 * 총 포인트 계산
 * @param {*} totalAmount - 총 금액
 * @returns {number} 총 포인트
 */
export const getTotalBonusPoints = totalAmount =>
  Math.floor(totalAmount / CONSTANTS.LOYALTY_POINTS_RATE);
