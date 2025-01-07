import {
  getBulkDiscountRate,
  getDayDiscountRate,
  getItemQuantityDiscountRate,
} from '../utils/discount.utils';

import type { Product } from '../types/product.type';

const calculateProductSubtotal = (product: Product, applyDiscount = true): number => {
  if (!applyDiscount) {
    return product.originalPrice * product.quantity;
  }

  const discount = getItemQuantityDiscountRate(product.id, product.quantity);

  return product.originalPrice * product.quantity * (1 - discount);
};

/**
 * 장바구니 개별 상품들의 할인 적용된 금액을 계산합니다.
 *
 * @param cartProducts - 장바구니에 담긴 상품 목록
 * @returns {number} 개별상품의 할인 적용된 총 금액
 */
const calculateProductsPrice = (cartProducts: Product[]): number => {
  return cartProducts.reduce((total, product) => total + calculateProductSubtotal(product), 0);
};

const calculateOriginalPrice = (cartProducts: Product[]): number => {
  return cartProducts.reduce(
    (total, product) => total + calculateProductSubtotal(product, false),
    0
  );
};

const calculateCartTotalQuantity = (cartProducts: Product[]): number => {
  return cartProducts.reduce((total, product) => total + product.quantity, 0);
};

const calculateBulkDiscountRate = (
  cartTotalQuantity: number,
  originalTotalPrice: number,
  totalAmount: number
): number => {
  const bulkDiscountRate = getBulkDiscountRate(cartTotalQuantity);

  if (bulkDiscountRate === 0) {
    return (originalTotalPrice - totalAmount) / originalTotalPrice;
  }

  const bulkDiscount = originalTotalPrice * bulkDiscountRate;
  const itemDiscount = originalTotalPrice - totalAmount;

  return bulkDiscount > itemDiscount ? bulkDiscountRate : itemDiscount / originalTotalPrice;
};

/**
 * 장바구니 상품들의 최종 결제 금액과 할인율을 계산합니다.
 *
 * @param cartItems - 장바구니에 담긴 상품 목록
 * @returns {object} 최종 계산 결과
 *   @returns {number} amount - 할인이 적용된 최종 결제 금액
 *   @returns {number} discountRate - 적용된 최종 할인율 (대량구매 할인율과 요일별 할인율 중 큰 값)
 */
export const calculateFinalAmount = (cartItems: Product[]) => {
  const originalTotalPrice = calculateOriginalPrice(cartItems);
  const bulkDiscountRate = calculateBulkDiscountRate(
    calculateCartTotalQuantity(cartItems),
    originalTotalPrice,
    calculateProductsPrice(cartItems)
  );
  const dayDiscountRate = getDayDiscountRate();
  const finalDiscountRate = Math.max(bulkDiscountRate, dayDiscountRate);

  return {
    amount: originalTotalPrice * (1 - finalDiscountRate),
    discountRate: finalDiscountRate,
  };
};
