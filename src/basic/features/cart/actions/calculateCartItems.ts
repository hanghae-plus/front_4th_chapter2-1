import { Product } from '../../../shared/entity/model/Product';
import { getTotalPriceBeforeSpecialOffer } from './getTotalPriceBeforeSpecialOffer';

const calculateCartItems = (
  {
    cartItems = [],
    productList,
  }: {
    cartItems: HTMLDivElement[];
    productList: Product[];
  },
  callback: (finalPrice: number, discountRate: number) => void,
) => {
  let finalPrice = 0;
  const { subTotalPrice, totalItemCount, totalPrice } =
    getTotalPriceBeforeSpecialOffer(cartItems, productList);

  finalPrice = totalPrice;
  let discountRate = 0;
  if (totalItemCount >= 30) {
    const bulkDiscount = totalPrice * 0.25;
    const itemDiscount = subTotalPrice - totalPrice;
    if (bulkDiscount > itemDiscount) {
      finalPrice = subTotalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotalPrice - finalPrice) / subTotalPrice;
    }
  } else {
    discountRate = (subTotalPrice - finalPrice) / subTotalPrice;
  }
  if (new Date().getDay() === 2) {
    finalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  callback(finalPrice, discountRate);

  return {
    finalPrice,
    discountRate,
  };
};

export { calculateCartItems };
