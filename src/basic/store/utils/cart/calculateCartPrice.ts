import type { Product } from '../../cartStore';

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

  // 총액을 처리하는 엘리먼트에 string을 처리한다
  // TotalPrice 컴포넌트에서 처리
  // sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  // 할인율이 0보다 크면
  if (finalDiscountRate > 0) {
    // 총액을 처리하는 엘리먼트에 클래스와 string을 입혀 넣는다.
    // TotalPrice 컴포넌트에서 처리
    // const span = document.createElement('span');
    // span.className = 'text-green-500 ml-2';
    // span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    // sum.appendChild(span);
  }
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
    const { val, q } = cartItem;

    const cartItemTotalAmount = val * q;
    const discountRate = calculateTotalDiscountRate(q, cartItem.id as ProductId);

    totalQuantity = sumQuantity(cartItem.q);
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

// 최종가 계산할 떄 할인 적용하는 함수
function getDiscountedAmount(totalQuantity: number, totalAmount: number, totalDiscountedAmount: number) {
  let discountRate = 0;

  const quantity = totalQuantity;
  const discountedAmount = totalDiscountedAmount;
  let amount = totalAmount;

  if (quantity >= QUANTITY_THRESHOLD_FOR_FINAL_AMOUNT) {
    const bulkDiscountAmount = amount * BULK_DISCOUNT_RATE;
    const discountAmount = discountedAmount - amount;

    if (bulkDiscountAmount > discountAmount) {
      amount = discountedAmount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (discountedAmount - amount) / discountedAmount;
    }
  } else {
    discountRate = (discountedAmount - amount) / discountedAmount;
  }

  return { discountRate, bulkDiscountedAmount: amount };
}

function getTuesdayDiscount(discountRate: number, bulkDiscountedAmount: number) {
  const isTuesday = new Date().getDay() === 2;
  let finalAmount = bulkDiscountedAmount;

  // 화요일이면! (화요일만 특수하게 할인 로직이 들어간다)
  if (isTuesday) {
    // 총액에 0.9를 곱한다
    finalAmount *= 1 - 0.1;
    // 할인율이 0.1보다 큰 걸 처리하는듯?
    discountRate = Math.max(discountRate, 0.1);
  }

  return { finalAmount, finalDiscountRate: discountRate };
}
