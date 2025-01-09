import { DAY_OF_WEEK } from '../constants/day';
import { DISCOUNT_POLICY } from '../constants/policy';
import { applyDiscount } from '../utils/discount';

export const calculateItemDiscount = (cartItems) => {
  const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const finalAmount = calculateTotalPrice(cartItems);
  const discountRate = (subTotal - finalAmount) / subTotal;

  return {
    subTotal,
    finalAmount,
    discountRate,
  };
};

export const calculateBulkDiscount = (subTotal, finalAmount, totalItemCount) => {
  if (totalItemCount < DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    return {
      finalAmount,
      discountRate: (subTotal - finalAmount) / subTotal,
    };
  }

  const bulkDiscountAmount = applyDiscount({
    amount: subTotal,
    discountRate: DISCOUNT_POLICY.BULK_DISCOUNT_RATE,
  });

  const itemDiscount = subTotal - finalAmount;

  if (bulkDiscountAmount > itemDiscount) {
    return {
      finalAmount: bulkDiscountAmount,
      discountRate: DISCOUNT_POLICY.BULK_DISCOUNT_RATE,
    };
  }

  return {
    finalAmount,
    discountRate: (subTotal - finalAmount) / subTotal,
  };
};

export const calculateWeeklyDiscount = (finalAmount, currentDiscountRate) => {
  if (new Date().getDay() !== DAY_OF_WEEK.TUESDAY) {
    return { finalAmount, discountRate: currentDiscountRate };
  }

  const weeklyDiscountRate = DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday;
  const discountedAmount = applyDiscount({
    amount: finalAmount,
    discountRate: weeklyDiscountRate,
  });

  return {
    finalAmount: discountedAmount,
    discountRate: Math.max(currentDiscountRate, weeklyDiscountRate),
  };
};

const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const itemAmount = item.price * item.quantity;
    let discountRate = 0;

    if (item.quantity >= DISCOUNT_POLICY.MIN_QUANTITY_FOR_DISCOUNT) {
      discountRate = DISCOUNT_POLICY.PRODUCT_DISCOUNT_RATES[item.id] || 0;
    }

    return total + applyDiscount({ amount: itemAmount, discountRate });
  }, 0);
};
