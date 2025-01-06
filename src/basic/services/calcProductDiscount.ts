import {
  ITEM_QUANTITY_DISCOUNT_RATES,
  DAY_DISCOUNT_RATES,
  BULK_DISCOUNT_RATES,
  ITEM_QUANTITY_DISCOUNT_THRESHOLD,
  BULK_DISCOUNT_THRESHOLD,
} from '../constants/discount.constant';

import type { Product } from '../types/product.type';

// 상품 갯수에 따른 할인율 계산
const getItemQuantityDiscountRate = (productId: string, quantity: number): number => {
  if (quantity >= ITEM_QUANTITY_DISCOUNT_THRESHOLD) {
    return ITEM_QUANTITY_DISCOUNT_RATES[productId] || 0;
  }

  return 0;
};

export const getBulkDiscountRate = (cartTotalQuantity: number): number => {
  if (cartTotalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    return BULK_DISCOUNT_RATES;
  }

  return 0;
};

export const calculateDayDiscountRate = (): number => {
  const today = new Date().getDay();

  return DAY_DISCOUNT_RATES[today];
};

const calculateItemSubtotal = (item: Product, applyDiscount = true): number => {
  if (!applyDiscount) {
    return item.originalPrice * item.quantity;
  }

  const discount = getItemQuantityDiscountRate(item.id, item.quantity);

  return item.originalPrice * item.quantity * (1 - discount);
};

export const calculateItemPrice = (cartItems: Product[]): number => {
  return cartItems.reduce((total, item) => total + calculateItemSubtotal(item), 0);
};

export const calculateOriginalPrice = (cartItems: Product[]): number => {
  return cartItems.reduce((total, item) => total + calculateItemSubtotal(item, false), 0);
};

export const calculateBulkDiscountRate = (
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

export const calculateFinalAmount = (cartItems: Product[]) => {
  const originalTotalPrice = calculateOriginalPrice(cartItems);
  const bulkDiscountRate = calculateBulkDiscountRate(
    cartItems.reduce((total, item) => total + item.quantity, 0),
    originalTotalPrice,
    calculateItemPrice(cartItems)
  );
  const dayDiscountRate = calculateDayDiscountRate();
  const finalDiscountRate = Math.max(bulkDiscountRate, dayDiscountRate);
  
  return {
    amount: originalTotalPrice * (1 - finalDiscountRate),
    discountRate: finalDiscountRate
  };
}