import { getDiscountRate } from '../../../shared/actions/getDiscountRate';
import { DISCOUNT_RATE } from '../../../shared/constant/discountRate';
import { Product } from '../../../shared/entity/model/Product';

const getTotalPriceBeforeSpecialOffer = (
  cartItems: HTMLCollection,
  productList: Product[],
): {
  totalPrice: number;
  totalItemCount: number;
  subTotalPrice: number;
} => {
  let totalPrice = 0;
  let subTotalPrice = 0;
  let totalItemCount = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      const currentItem = productList.find(
        (product) => product.id === cartItems[i].id,
      );
      if (!currentItem) return;

      const itemElement = document.getElementById(currentItem.id);
      const cartItemInfoSpan = itemElement?.querySelector('span');
      const cartItemSelectedCount =
        cartItemInfoSpan?.textContent?.split('x ')[1];
      if (!currentItem || !cartItemInfoSpan || !cartItemSelectedCount) return;

      const currentQuantity = parseInt(cartItemSelectedCount);
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
