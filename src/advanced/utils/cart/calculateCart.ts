import type { Product } from '../../types/product';

type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';
type DiscountRates = Record<ProductId, number>;

const PRODUCT_DISCOUNT_RATES: DiscountRates = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
} as const;

export const TUESDAY_DISCOUNT_RATE = 0.1;
export const BULK_DISCOUNT_RATE = 0.25;

export const QUANTITY_THRESHOLDS = {
  BULK_PURCHASE: 30,
  PRODUCT_DISCOUNT: 10,
} as const;

export const calculateCartPrice = (cartList: Product[]) => {
  const totals = calculateCartTotals(cartList);
  const bulkDiscount = calculateBulkDiscount(totals);
  const { finalAmount, finalDiscountRate } = applyTuesdayDiscount(bulkDiscount);

  // 재고 함수 호출
  // updateStockInfo();

  // 보너스 함수 호출
  const point = getBonusPoint(finalAmount);

  return { finalAmount, finalDiscountRate, point };
};

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

// 대량 구매 할인 로직
function calculateBulkDiscount(totals: ReturnType<typeof calculateCartTotals>) {
  const { totalQuantity, totalAmount, totalDiscountedAmount } = totals;

  if (totalQuantity <= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    return calculateRegularDiscount(totalAmount, totalDiscountedAmount);
  }

  if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    const bulkDiscountAmount = totalAmount * BULK_DISCOUNT_RATE;
    const discountAmount = totalAmount - totalDiscountedAmount;

    return bulkDiscountAmount > discountAmount
      ? {
          discountRate: BULK_DISCOUNT_RATE,
          finalDiscountedAmount: totalAmount * (1 - BULK_DISCOUNT_RATE),
        }
      : calculateRegularDiscount(totalAmount, totalDiscountedAmount);
  }

  return {
    discountRate: 0,
    finalDiscountedAmount: totalDiscountedAmount,
  };
}

// 화요일 할인 로직
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
    finalAmount: (finalDiscountedAmount *= 1 - 0.1),
    finalDiscountRate: (discountRate = Math.max(discountRate, 0.1)),
  };
}

function getBonusPoint(amount: number) {
  const bonusPoint = Math.floor(amount / 1000);

  return bonusPoint;
}
