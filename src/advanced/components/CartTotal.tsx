import {
  DISCOUNT_RATES,
  DOM_IDS,
  ITEMS_REQUIRED_FOR_DISCOUNT,
} from "advanced/constants";
import { useCartContext } from "advanced/contexts/CartProvider";

export const CartTotal = () => {
  const { cartState } = useCartContext();

  // 10개 이상 구매시 할인율
  const getDiscountRate = (productID: string) => {
    const discountMap: Record<string, number> = {
      p1: DISCOUNT_RATES.TEN_PERCENT,
      p2: DISCOUNT_RATES.FIFTEEN_PERCENT,
      p3: DISCOUNT_RATES.TWENTY_PERCENT,
      p4: DISCOUNT_RATES.FIVE_PERCENT,
      p5: DISCOUNT_RATES.TWENTY_FIVE_PERCENT,
    };

    return discountMap[productID] || 0;
  };

  const cartOriginalPrice = cartState.items.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );

  // 총액
  let finalPrice = cartOriginalPrice;

  // 할인율
  let discountRate = 0;

  cartState.items.forEach((item) => {
    // 10개 이상 구매 시, 상품에 따른 할인율 적용
    if (item.quantity >= ITEMS_REQUIRED_FOR_DISCOUNT.DEFAULT) {
      discountRate = getDiscountRate(item.id);
      finalPrice = cartOriginalPrice * (1 - discountRate);
    }
  });

  const cartTotalQuantity = cartState.items.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  );

  if (cartTotalQuantity >= ITEMS_REQUIRED_FOR_DISCOUNT.BIG) {
    const bulkDiscountedPrice =
      cartOriginalPrice * DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    const priceGap = cartOriginalPrice - finalPrice;

    // 현재 적용된 할인 금액이 25% 할인보다 적을 경우, 25% 할인으로 덮어쓰기
    if (bulkDiscountedPrice > priceGap) {
      finalPrice = cartOriginalPrice * (1 - DISCOUNT_RATES.TWENTY_FIVE_PERCENT);
      discountRate = DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    }
  }

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
