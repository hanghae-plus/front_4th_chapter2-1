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
  const { finalPrice, finalDiscountRate } = applyTuesdayDiscount(bulkDiscount);

  const point = getBonusPoint(finalPrice);

  return { finalPrice, finalDiscountRate, point };
};

// 장바구니 토탈 가격 및 재고 계산
const calculateCartTotals = (cartList: Product[]) => {
  return cartList.reduce(
    (acc, item) => {
      const itemTotal = item.price * item.quantity;
      const discountRate = calculateTotalDiscountRate(item);
      const discountedPrice = itemTotal * (1 - discountRate);

      return {
        totalQuantity: acc.totalQuantity + item.quantity,
        totalPrice: acc.totalPrice + itemTotal,
        totalDiscountedPrice: acc.totalDiscountedPrice + discountedPrice,
      };
    },
    { totalQuantity: 0, totalPrice: 0, totalDiscountedPrice: 0 },
  );
};

function calculateTotalDiscountRate(item: Product) {
  if (item.quantity < QUANTITY_THRESHOLDS.PRODUCT_DISCOUNT) return 0;
  return PRODUCT_DISCOUNT_RATES[item.id as ProductId] ?? 0;
}

const calculateRegularDiscount = (totalPrice: number, totalDiscountedPrice: number) => {
  return {
    discountRate: (totalPrice - totalDiscountedPrice) / totalPrice,
    finalDiscountedPrice: totalDiscountedPrice,
  };
};

// 대량 구매 할인
function calculateBulkDiscount(totals: ReturnType<typeof calculateCartTotals>) {
  const { totalQuantity, totalPrice, totalDiscountedPrice } = totals;

  if (totalQuantity <= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    return calculateRegularDiscount(totalPrice, totalDiscountedPrice);
  }

  if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_PURCHASE) {
    const bulkDiscountPrice = totalPrice * DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    const discountPrice = totalPrice - totalDiscountedPrice;

    return bulkDiscountPrice > discountPrice
      ? {
          discountRate: DISCOUNT_RATES.TWENTY_FIVE_PERCENT,
          finalDiscountedPrice: totalPrice * (1 - DISCOUNT_RATES.TWENTY_FIVE_PERCENT),
        }
      : calculateRegularDiscount(totalPrice, totalDiscountedPrice);
  }

  return {
    discountRate: 0,
    finalDiscountedPrice: totalDiscountedPrice,
  };
}

// 화요일 할인
function applyTuesdayDiscount(total: ReturnType<typeof calculateBulkDiscount>) {
  let { discountRate, finalDiscountedPrice } = total;

  const isTuesday = new Date().getDay() === 2;

  if (!isTuesday) {
    return {
      finalPrice: finalDiscountedPrice,
      finalDiscountRate: discountRate,
    };
  }

  return {
    finalPrice: (finalDiscountedPrice *= 1 - DISCOUNT_RATES.TEN_PERCENT),
    finalDiscountRate: (discountRate = Math.max(discountRate, DISCOUNT_RATES.TEN_PERCENT)),
  };
}

// 포인트 계산
function getBonusPoint(price: number) {
  const bonusPoint = Math.floor(price / 1000);

  return bonusPoint;
}
