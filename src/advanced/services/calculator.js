import { updateProductState } from '../stores/product.store';
import { calculatePoint, getTotalQuantity } from '../utils/cart';
import { calculateBulkDiscount, calculateItemDiscount, calculateWeeklyDiscount } from './discount';

export const calculateCartTotals = (cartItems) => {
  // 1. 개별 상품 할인 계산
  const itemDiscount = calculateItemDiscount(cartItems);
  const totalItemCount = getTotalQuantity(cartItems);

  // 2. 대량 구매 할인 계산
  const bulkDiscount = calculateBulkDiscount(itemDiscount.subTotal, itemDiscount.finalAmount, totalItemCount);

  // 3. 요일별 할인 계산
  const weeklyDiscount = calculateWeeklyDiscount(bulkDiscount.finalAmount, bulkDiscount.discountRate);

  // 4. 포인트 계산
  const point = calculatePoint(weeklyDiscount.finalAmount);

  return {
    totalItemCount,
    finalAmount: weeklyDiscount.finalAmount,
    discountRate: weeklyDiscount.discountRate,
    point,
  };
};

export const calculateCart = (callbackFn) => {
  const cartItems = cartStore.getCartItems();

  // 1. 계산
  const totals = calculateCartTotals(cartItems);

  // 2. 상태 업데이트
  const updatedTotals = updateProductState(totals);

  // 3. Side Effect
  callbackFn(updatedTotals);

  return updatedTotals;
};
