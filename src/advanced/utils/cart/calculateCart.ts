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
export const QUANTITY_THRESHOLD_FOR_FINAL_AMOUNT = 30;
const QUANTITY_THRESHOLD_FOR_TOTAL_AMOUNT = 10;

export const calculateCartPrice = (cartList: Product[]) => {
  const { totalQuantity, totalAmount, totalDiscountedAmount } = getCartItemsInfo(cartList);

  const { discountRate, bulkDiscountedAmount } = getDiscountedAmount(totalQuantity, totalAmount, totalDiscountedAmount);

  const { finalAmount, finalDiscountRate } = getTuesdayDiscount(discountRate, bulkDiscountedAmount);

  // 재고 함수 호출
  // updateStockInfo();

  // 보너스 함수 호출
  // renderBonusPts();

  return { finalAmount, finalDiscountRate };
};

function getCartItemsInfo(cartList: Product[]) {
  let totalQuantity = 0;
  let totalAmount = 0;
  let totalDiscountedAmount = 0;

  const sumQuantity = createSum();
  const sumAmount = createSum();
  const sumDiscountedAmount = createSum();

  for (const cartItem of cartList) {
    const { amount, quantity } = cartItem;

    const cartItemTotalAmount = amount * quantity;
    const discountRate = calculateTotalDiscountRate(quantity, cartItem.id as ProductId);

    totalQuantity = sumQuantity(cartItem.quantity);
    totalAmount = sumAmount(cartItemTotalAmount);
    totalDiscountedAmount = sumDiscountedAmount(cartItemTotalAmount * (1 - discountRate));
  }

  return {
    totalQuantity,
    totalAmount,
    totalDiscountedAmount,
  };
}

function getProductBaseDiscountRate(productId: ProductId): number {
  return PRODUCT_DISCOUNT_RATES[productId] ?? 0;
}

function isOverDiscountQuantity(quantity: number): boolean {
  return quantity >= QUANTITY_THRESHOLD_FOR_TOTAL_AMOUNT;
}

function calculateTotalDiscountRate(quantity: number, id: ProductId) {
  const baseDiscountRate = getProductBaseDiscountRate(id);
  return isOverDiscountQuantity(quantity) ? baseDiscountRate : 0;
}

function createSum() {
  let sum = 0;

  return (value: number) => {
    return (sum += value);
  };
}

// 대량 구매 할인 로직
function getDiscountedAmount(totalQuantity: number, totalAmount: number, totalDiscountedAmount: number) {
  let discountRate = 0;
  let finalAmount = totalAmount;

  if (totalQuantity >= QUANTITY_THRESHOLD_FOR_FINAL_AMOUNT) {
    const bulkDiscountAmount = totalAmount * BULK_DISCOUNT_RATE;
    const individualDiscountAmount = totalAmount - totalDiscountedAmount;

    if (bulkDiscountAmount > individualDiscountAmount) {
      finalAmount = totalAmount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (totalAmount - totalDiscountedAmount) / totalAmount;
    }
  } else {
    discountRate = (totalAmount - totalDiscountedAmount) / totalAmount;
  }

  return {
    discountRate,
    bulkDiscountedAmount: finalAmount,
  };
}

// 화요일 할인 로직
function getTuesdayDiscount(discountRate: number, bulkDiscountedAmount: number) {
  const isTuesday = new Date().getDay() === 2;
  let finalAmount = bulkDiscountedAmount;

  if (isTuesday) {
    finalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  return { finalAmount, finalDiscountRate: discountRate };
}
