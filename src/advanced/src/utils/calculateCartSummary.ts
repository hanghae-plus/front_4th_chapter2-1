import { Item } from '../types';

interface CartSummary {
  totalDiscountRate: number;
  totalAmountBeforeDiscount: number;
  totalItemCount: number;
}

const DEFAULT_SALE_BULK_AMOUNT = 10;
const BULK_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const SPECIAL_DAY = 2;
const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25
} as const;

/**
 * 장바구니 총액 및 할인율 계산
 * 상품이 기본적으로 DEFAULT_SALE_BULK_AMOUNT 이상이 되면 DISCOUNT_RATES별 할인률을 가진다. 할인률은 가중 평균으로 계산한다.
 * 총 상품 개수가 BULK_AMOUNT 이상이면 BULK_DISCOUNT_RATE를 적용한다.
 * 특정 요일(SPECIAL_DAY)에는 SPECIAL_DAY_DISCOUNT_RATE를 추가로 적용한다.
 * 여기서 기본할인률과 대량할인률은 둘 중에 높은 할인율을 적용한다. 특정 요일 할인은 기본할인률과 대량할인률 더 큰값에 추가되는 할인율이다.
 */
export const calculateCartSummary = (cartList: Item[]) => {
  const { totalAmountBeforeDiscount, totalItemCount, totalDiscountRate } = cartList.reduce(
    (acc, item) => {
      const itemAmount = item.price * item.volume;
      const discountRate = calculateDefaultDiscountRate(item);
      const discountedAmount = itemAmount * (1 - discountRate);
      const discountAmount = itemAmount * discountRate;

      return {
        totalAmount: acc.totalAmount + discountedAmount, // 할인 적용 후 총액
        totalDiscountAmount: acc.totalDiscountAmount + discountAmount, // 전체 할인 금액
        totalAmountBeforeDiscount: acc.totalAmountBeforeDiscount + itemAmount, // 할인 전 총액
        totalItemCount: acc.totalItemCount + item.volume, // 총 아이템 개수
        totalDiscountRate: (acc.totalDiscountAmount + discountAmount) / (acc.totalAmountBeforeDiscount + itemAmount) // 가중 평균 할인율
      };
    },
    {
      totalAmount: 0,
      totalDiscountAmount: 0,
      totalAmountBeforeDiscount: 0,
      totalItemCount: 0,
      totalDiscountRate: 0
    }
  );

  const updatedDiscountRate = calculateAdditionalDiscountRate({
    totalDiscountRate,
    totalAmountBeforeDiscount,
    totalItemCount
  });
  const totalAmount = totalAmountBeforeDiscount * (1 - updatedDiscountRate);

  return { totalAmount, totalDiscountRate: updatedDiscountRate };
};

const calculateDefaultDiscountRate = (item: Item) => {
  const { id, volume } = item;

  if (volume >= DEFAULT_SALE_BULK_AMOUNT) {
    return DISCOUNT_RATES[id as keyof typeof DISCOUNT_RATES];
  }
  return 0;
};

const calculateAdditionalDiscountRate = (summary: CartSummary) => {
  const { totalDiscountRate, totalItemCount } = summary;
  const today = new Date().getDay();

  let updatedDiscountRate = totalDiscountRate;

  if (totalItemCount >= BULK_AMOUNT) {
    updatedDiscountRate = applyBulkDiscount(totalDiscountRate);
  }

  if (today === SPECIAL_DAY) {
    updatedDiscountRate = applySpecialDayDiscount(updatedDiscountRate);
  }

  return updatedDiscountRate;
};

const applyBulkDiscount = (defaultDiscountRate: number) => {
  if (BULK_DISCOUNT_RATE <= defaultDiscountRate) {
    return defaultDiscountRate;
  }

  return BULK_DISCOUNT_RATE;
};

const applySpecialDayDiscount = (defaultDiscountRate: number) => {
  return defaultDiscountRate + SPECIAL_DAY_DISCOUNT_RATE;
};
