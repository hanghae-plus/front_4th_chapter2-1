import { getDiscountRate } from '../../../shared/actions/getDiscountRate';
import { DISCOUNT_RATE } from '../../../shared/constant/discountRate';
import { Product } from '../../../shared/entity/model/Product';

const getTotalPriceBeforeSpecialOffer = (
  cartItems: HTMLDivElement[],
  productList: Product[],
  totalItemCount: number,
): {
  totalPrice: number;
  totalItemCount: number;
  subTotalPrice: number;
} => {
  let totalPrice = 0;
  let subTotalPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      const currentItem = productList.find(
        (product) => product.id === cartItems[i].id,
      );
      if (!currentItem) return;
      const currentQuantity = parseInt(
        cartItems[i].querySelector('span')!.textContent!.split('x ')[1],
      );
      const itemTotalPrice = currentItem.price * currentQuantity;
      let discountRate = 0;
      totalItemCount += currentQuantity;
      subTotalPrice += itemTotalPrice;
      if (currentQuantity >= 10) {
        if (DISCOUNT_RATE[currentItem.id])
          discountRate = getDiscountRate(currentItem.id);
      }
      totalPrice += itemTotalPrice * (1 - discountRate);
    })();
  }
  return {
    totalPrice,
    totalItemCount,
    subTotalPrice,
  };
};

export { getTotalPriceBeforeSpecialOffer };
