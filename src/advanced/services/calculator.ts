import type { Cart } from '../types/cart.type';
import { calculatePoint, getTotalQuantity } from './cart';
import { calculateBulkDiscount, calculateItemDiscount, calculateWeeklyDiscount } from './discount';

export const calculateCartTotals = (cartItems: Cart[]) => {
  // 1. 개별 상품 할인 계산
  const itemDiscount = calculateItemDiscount(cartItems);
  const totalItemCount = getTotalQuantity(cartItems);

  // 2. 대량 구매 할인 계산
  const bulkDiscount = calculateBulkDiscount({
    subTotal: itemDiscount.subTotal,
    finalAmount: itemDiscount.finalAmount,
    totalItemCount,
  });

  // 3. 요일별 할인 계산
  const weeklyDiscount = calculateWeeklyDiscount({
    finalAmount: bulkDiscount.finalAmount,
    currentDiscountRate: bulkDiscount.discountRate,
  });

  // 4. 포인트 계산
  const point = calculatePoint(weeklyDiscount.finalAmount);

  return {
    totalItemCount,
    finalAmount: weeklyDiscount.finalAmount,
    discountRate: weeklyDiscount.discountRate,
    point,
  };
};
