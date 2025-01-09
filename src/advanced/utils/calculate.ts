import { Product, CartItem, DiscountResult } from "../types/cart";
import { INDIVIDUAL_DISCOUNTS } from "../constants/products";

interface CalculationState {
  subTotal: number;
  totalAmt: number;
  itemCount: number;
  items: Map<string, { quantity: number; product: Product }>;
}

function getIndividualDiscountRate(
  productId: string,
  quantity: number,
): number {
  return quantity >= 10 ? (INDIVIDUAL_DISCOUNTS[productId] ?? 0) : 0;
}

export function calculateCartTotal(
  cartItems: CartItem[],
  products: Product[],
): DiscountResult {
  // 초기값 설정
  const initial: CalculationState = {
    subTotal: 0,
    totalAmt: 0,
    itemCount: 0,
    items: new Map(),
  };

  // 각 아이템별 계산
  const calculated = cartItems.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return acc;

    const itemTotal = product.val * item.quantity;
    const discRate = getIndividualDiscountRate(item.productId, item.quantity);
    const discountedItemTotal = itemTotal * (1 - discRate);

    const newItems = new Map(acc.items);
    newItems.set(item.productId, { quantity: item.quantity, product });

    return {
      ...acc,
      items: newItems,
      subTotal: acc.subTotal + itemTotal,
      totalAmt: acc.totalAmt + discountedItemTotal,
      itemCount: acc.itemCount + item.quantity,
    };
  }, initial);

  // 대량 구매 할인 적용
  const bulkDiscounted = applyBulkDiscount(calculated);

  // 화요일 할인 적용
  return applyTuesdayDiscount(bulkDiscounted);
}

function applyBulkDiscount(data: CalculationState): DiscountResult {
  if (data.itemCount < 30) {
    const existedRate =
      data.subTotal === 0 ? 0 : (data.subTotal - data.totalAmt) / data.subTotal;
    return {
      total: data.totalAmt,
      discountRate: existedRate,
      items: data.items,
    };
  }

  const bulkDiscountAmount = data.subTotal * 0.25;
  const individualDiscountAmount = data.subTotal - data.totalAmt;

  if (bulkDiscountAmount > individualDiscountAmount) {
    return {
      total: data.subTotal * 0.75,
      discountRate: 0.25,
      items: data.items,
    };
  }

  const existedRate = (data.subTotal - data.totalAmt) / data.subTotal;
  return { total: data.totalAmt, discountRate: existedRate, items: data.items };
}

function applyTuesdayDiscount(data: DiscountResult): DiscountResult {
  if (new Date().getDay() !== 2) {
    return data;
  }
  return {
    total: data.total * 0.9,
    discountRate: Math.max(data.discountRate, 0.1),
    items: data.items,
  };
}
