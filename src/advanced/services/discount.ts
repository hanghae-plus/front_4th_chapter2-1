import { DAY_OF_WEEK } from '../constants/day';
import { DISCOUNT_POLICY } from '../constants/policy';
import type { Cart } from '../types/cart.type';

export const calculateItemDiscount = (cartItems: Cart[]) => {
  const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const finalAmount = calculateTotalPrice(cartItems);
  const discountRate = (subTotal - finalAmount) / subTotal;

  return {
    subTotal,
    finalAmount,
    discountRate,
  };
};

export const calculateBulkDiscount = ({
  subTotal,
  finalAmount,
  totalItemCount,
}: {
  subTotal: number;
  finalAmount: number;
  totalItemCount: number;
}) => {
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

export const calculateWeeklyDiscount = ({
  finalAmount,
  currentDiscountRate,
}: {
  finalAmount: number;
  currentDiscountRate: number;
}) => {
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

const calculateTotalPrice = (cartItems: Cart[]): number => {
  return cartItems.reduce((total, item) => {
    const itemAmount = item.price * item.quantity;
    let discountRate = 0;

    if (item.quantity >= DISCOUNT_POLICY.MIN_QUANTITY_FOR_DISCOUNT) {
      discountRate = DISCOUNT_POLICY.PRODUCT_DISCOUNT_RATES[item.id] || 0;
    }

    return total + applyDiscount({ amount: itemAmount, discountRate });
  }, 0);
};

export const applyDiscount = ({ amount, discountRate }: { amount: number; discountRate: number }) => {
  return amount * (1 - discountRate);
};
