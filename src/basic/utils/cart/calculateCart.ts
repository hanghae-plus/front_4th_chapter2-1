import { DISCOUNT_RATES } from '../../constants/discountRates';

import type { Product } from '../../types/product';

type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

const PRODUCT_DISCOUNT_RATES = {
  p1: DISCOUNT_RATES.TEN_PERCENT,
  p2: DISCOUNT_RATES.FIFTEEN_PERCENT,
  p3: DISCOUNT_RATES.TWENTY_PERCENT,
  p4: DISCOUNT_RATES.FIVE_PERCENT,
  p5: DISCOUNT_RATES.TWENTY_FIVE_PERCENT,
} as const;

export const QUANTITY_THRESHOLDS = {
  BULK_PURCHASE: 30,
  PRODUCT_DISCOUNT: 10,
} as const;

export const calculateCartPrice = (cartList: Product[]) => {
  const totals = calculateCartTotals(cartList);
  const bulkDiscount = calculateBulkDiscount(totals);
  const { finalAmount, finalDiscountRate } = applyTuesdayDiscount(bulkDiscount);

  const point = getBonusPoint(finalAmount);

  return { finalAmount, finalDiscountRate, point };
};

// 장바구니 토탈 가격 및 재고 계산
const calculateCartTotals = (cartList: Product[]) => {
  return cartList.reduce(
    (acc, item) => {
      const itemTotal = item.amount * item.quantity;
      const discountRate = calculateTotalDiscountRate(item);
      const discountedAmount = itemTotal * (1 - discountRate);

      return {
        totalQuantity: acc.totalQuantity + item.quantity,
        totalAmount: acc.totalAmount + itemTotal,
        totalDiscountedAmount: acc.totalDiscountedAmount + discountedAmount,
      };
    },
    { totalQuantity: 0, totalAmount: 0, totalDiscountedAmount: 0 },
  );
};

function calculateTotalDiscountRate(item: Product) {
  if (item.quantity < QUANTITY_THRESHOLDS.PRODUCT_DISCOUNT) return 0;
  return PRODUCT_DISCOUNT_RATES[item.id as ProductId] ?? 0;
}

const calculateRegularDiscount = (totalAmount: number, totalDiscountedAmount: number) => {
  return {
    discountRate: (totalAmount - totalDiscountedAmount) / totalAmount,
    finalDiscountedAmount: totalDiscountedAmount,
  };
};

// 대량 구매 할인
function calculateBulkDiscount(totals: ReturnType<typeof calculateCartTotals>) {
  const { totalQuantity, totalAmount, totalDiscountedAmount } = totals;

  if (totalQuantity <= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    return calculateRegularDiscount(totalAmount, totalDiscountedAmount);
  }

  if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    const bulkDiscountAmount = totalAmount * DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    const discountAmount = totalAmount - totalDiscountedAmount;

    return bulkDiscountAmount > discountAmount
      ? {
          discountRate: DISCOUNT_RATES.TWENTY_FIVE_PERCENT,
          finalDiscountedAmount: totalAmount * (1 - DISCOUNT_RATES.TWENTY_FIVE_PERCENT),
        }
      : calculateRegularDiscount(totalAmount, totalDiscountedAmount);
  }

  return {
    discountRate: 0,
    finalDiscountedAmount: totalDiscountedAmount,
  };
}

// 화요일 할인
function applyTuesdayDiscount(total: ReturnType<typeof calculateBulkDiscount>) {
  let { discountRate, finalDiscountedAmount } = total;

  const isTuesday = new Date().getDay() === 2;

  if (!isTuesday) {
    return {
      finalAmount: finalDiscountedAmount,
      finalDiscountRate: discountRate,
    };
  }

  return {
    finalAmount: (finalDiscountedAmount *= 1 - DISCOUNT_RATES.TEN_PERCENT),
    finalDiscountRate: (discountRate = Math.max(discountRate, DISCOUNT_RATES.TEN_PERCENT)),
  };
}

// 포인트 계산
function getBonusPoint(amount: number) {
  const bonusPoint = Math.floor(amount / 1000);

  return bonusPoint;
}
