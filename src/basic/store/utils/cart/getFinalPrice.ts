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

const calculateCartPrice = (cartList: Product[]) => {
  let totalAmt = 0;
  const itemCnt = 0;
  const subTot = 0;

  const { totalQuantity, totalAmount, totalDiscountedAmount } = getCartItemsInfo(cartList);

  // 할인율 같음
  let discRate = 0;

  // itemCount가 30이 넘으면 할인 로직을 따로 처리하는 듯
  if (itemCnt >= 30) {
    // itemCount가 30이 넘으면 총액의 0.25를 곱해 할당
    const bulkDisc = totalAmt * 0.25;

    // 현재 아이템들의 총액에 카트 총액을 빼서 할당
    const itemDisc = subTot - totalAmt;

    // itemDisc보다 총액의 0.25를 곱한 값이 더 크면
    if (bulkDisc > itemDisc) {
      // 총액에 현재 아이템에서 0.75를 곱해 총액에 할당
      totalAmt = subTot * (1 - 0.25);
      // 할인율 할당
      discRate = 0.25;
    } else {
      // itemDisc보다 총액의 0.25를 곱한 값이 더 크지 않으면
      // 할인율에 현재 아이템의 총액에서 카트의 총액을 빼고 해당 값을 현재 아이템의 총액만큼 나누어서 할당
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    // itemCount가 30이 넘지 않으면
    // 할인율에 현재 아이템의 총액에서 카트의 총액을 빼고 해당 값을 현재 아이템의 총액만큼 나누어서 할당
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일이면! (화요일만 특수하게 할인 로직이 들어간다)
  if (new Date().getDay() === 2) {
    // 총액에 0.9를 곱한다
    totalAmt *= 1 - 0.1;
    // 할인율이 0.1보다 큰 걸 처리하는듯?
    discRate = Math.max(discRate, 0.1);
  }

  // 총액을 처리하는 엘리먼트에 string을 처리한다
  // TotalPrice 컴포넌트에서 처리
  // sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

  // 할인율이 0보다 크면
  if (discRate > 0) {
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

    // 현재 아이템으로 선택된 아이템의 재고 총액
    const cartItemTotalAmount = val * q;

    // 아이템의 할인율
    const discountRate = calculateTotalDiscountRate(q, cartItem.id as ProductId);

    // 재고의 합
    totalQuantity = sumQuantity(cartItem.q);

    // 현재 아이템의 총액을 subTotal에 더한다.
    totalAmount = sumAmount(cartItemTotalAmount);

    // 총액에 현재 아이템의 총액에 할인율을 계산한 값을 할당
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
    const bulkDisc = amount * BULK_DISCOUNT_RATE;

    const itemDisc = discountedAmount - amount;

    if (bulkDisc > itemDisc) {
      amount = discountedAmount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (discountedAmount - amount) / discountedAmount;
    }
  } else {
    discountRate = (discountedAmount - amount) / discountedAmount;
  }

  return { discountRate, amount };
}
