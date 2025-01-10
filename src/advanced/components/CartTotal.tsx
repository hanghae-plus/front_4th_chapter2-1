import {
  DISCOUNT_RATES,
  DOM_IDS,
  ITEMS_REQUIRED_FOR_DISCOUNT,
  TUESDAY,
} from "advanced/constants";
import { useCartContext } from "advanced/hooks/useCartContext";

/**
 * (10개 이상 구매시) 상품별 할인율 추출
 *
 * @param productID  - 할인율을 구할 상품ID
 * @returns 품목별 할인율을 반환한다.
 */
const getDiscountRate = (productID: string): number => {
  const discountMapByItem: Record<string, number> = {
    p1: DISCOUNT_RATES.TEN_PERCENT,
    p2: DISCOUNT_RATES.FIFTEEN_PERCENT,
    p3: DISCOUNT_RATES.TWENTY_PERCENT,
    p4: DISCOUNT_RATES.FIVE_PERCENT,
    p5: DISCOUNT_RATES.TWENTY_FIVE_PERCENT,
  };

  return discountMapByItem[productID] || 0;
};

/**
 * 품목별 10개 구매시 할인 적용
 *
 * @param cartOriginalPrice - 장바구니에 담겨있는 상품들의 가격
 * @param items - 10개 구매 할인을 적용할 상품의 id, qty
 * @returns 할인율을 적용한 가격과 할인율을 반환한다.
 */
const applyDiscount = (
  cartOriginalPrice: number,
  items: { id: string; qty: number }[]
): { discountedPrice: number; discountedRate: number } => {
  // 총액
  let discountedPrice = cartOriginalPrice;
  // 할인율
  let discountedRate = 0;

  items.forEach((item) => {
    // 10개 이상 구매 시, 상품에 따른 할인율 적용
    if (item.qty >= ITEMS_REQUIRED_FOR_DISCOUNT.DEFAULT) {
      discountedRate = getDiscountRate(item.id);
      discountedPrice = cartOriginalPrice * (1 - discountedRate);
    }
  });

  return { discountedPrice, discountedRate };
};

/**
 * 품목 상관없이 30개 이상 구매 시 25% 할인
 *
 * @param cartTotalQty -
 * @param cartOriginalPrice -
 * @param finalPrice -
 * @param discountRate
 * @returns
 */
const applyBulkDiscount = (
  cartTotalQty: number,
  cartOriginalPrice: number,
  finalPrice: number,
  discountRate: number
): { bulkDiscountedPrice: number; bulkDiscountedRate: number } => {
  if (cartTotalQty >= ITEMS_REQUIRED_FOR_DISCOUNT.BIG) {
    const bulkDiscountedPrice =
      cartOriginalPrice * DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    const priceGap = cartOriginalPrice - finalPrice;

    // 현재 적용된 할인 금액이 25% 할인보다 적을 경우, 25% 할인으로 덮어쓰기
    if (bulkDiscountedPrice > priceGap) {
      finalPrice = cartOriginalPrice * (1 - DISCOUNT_RATES.TWENTY_FIVE_PERCENT);
      discountRate = DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    }
  }

  return { bulkDiscountedPrice: finalPrice, bulkDiscountedRate: discountRate };
};

/**
 * 화요일 특별 (추가)할인
 */
const applyTuesdayDiscount = (
  finalPrice: number,
  discountRate: number
): { tuesdayDiscountedPrice: number; tuesdayDiscountedRate: number } => {
  const today = new Date().getDay();

  if (today === TUESDAY) {
    finalPrice *= 1 - DISCOUNT_RATES.TEN_PERCENT;
    discountRate = Math.max(discountRate, DISCOUNT_RATES.TEN_PERCENT);
  }

  return {
    tuesdayDiscountedPrice: finalPrice,
    tuesdayDiscountedRate: discountRate,
  };
};

/**
 * 세 가지 할인 적용 후 최종 가격 및 할인율 구하기
 *
 * @param list - 할인 적용할 상품이 담긴 리스트
 * @returns 세 가지 할인 적용 후 최종 가격 및 할인율
 */
const applyAllDiscounts = (
  list: { id: string; price: number; qty: number }[]
): { finalPrice: number; discountRate: number } => {
  const cartOriginalPrice = list.reduce(
    (acc, cur) => acc + cur.price * cur.qty,
    0
  );

  const { discountedPrice, discountedRate } = applyDiscount(
    cartOriginalPrice,
    list
  );

  const cartTotalQty = list.reduce((acc, cur) => acc + cur.qty, 0);

  const { bulkDiscountedPrice, bulkDiscountedRate } = applyBulkDiscount(
    cartTotalQty,
    cartOriginalPrice,
    discountedPrice,
    discountedRate
  );

  const {
    tuesdayDiscountedPrice: finalPrice,
    tuesdayDiscountedRate: finalDiscountRate,
  } = applyTuesdayDiscount(bulkDiscountedPrice, bulkDiscountedRate);

  const discountRate = finalDiscountRate || discountedRate;

  return { finalPrice, discountRate };
};

export const CartTotal = () => {
  const { cartState } = useCartContext();

  const { finalPrice, discountRate } = applyAllDiscounts(cartState.items);
  // 포인트
  const point = Math.floor(finalPrice / 1000);

  return (
    <div id={DOM_IDS.CART_TOTAL} className="my-4 text-xl font-bold">
      총액: {Math.round(finalPrice)}원
      {discountRate > 0 && (
        <span className="ml-2 text-green-500">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span id={DOM_IDS.LOYALTY_POINTS} className="ml-2 text-blue-500">
        (포인트: {point})
      </span>
    </div>
  );
};
