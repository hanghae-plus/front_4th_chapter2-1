import { DISCOUNT_RATES } from "advanced/constants";

// 10개 이상 구매시 할인율
export const getDiscountRate = (productID: string) => {
  switch (productID) {
    // 상품1: 10% 할인
    case "p1":
      return DISCOUNT_RATES.TEN_PERCENT;
    // 상품2: 15% 할인
    case "p2":
      return DISCOUNT_RATES.FIFTEEN_PERCENT;
    // 상품3: 20% 할인
    case "p3":
      return DISCOUNT_RATES.TWENTY_PERCENT;
    case "p4":
      return DISCOUNT_RATES.FIVE_PERCENT;
    case "p5":
      return DISCOUNT_RATES.TWENTY_FIVE_PERCENT;
    default:
      return 0;
  }
};
