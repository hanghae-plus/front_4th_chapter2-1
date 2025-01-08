import { getQuantityFromItemNode } from './getQuantityFromItemNode.ts';
import { MIN_QUANTITY_FOR_PRODUCT_DISCOUNT, ProductDiscountMap } from '../constants/discount-contants.ts';
import { Product } from '../types/product';

export const getProductDiscountedTotalAmount = ($cartItems: HTMLOptionElement[], productList: Product[]) => {
  let totalAmt = 0;
  for (const $cartItem of $cartItems) {
    const curItem = productList.find((prod) => prod.id === $cartItem.id)!;

    const quantity = getQuantityFromItemNode($cartItem);

    const itemTotal = curItem.val * quantity;

    let discount = 0;

    if (quantity >= MIN_QUANTITY_FOR_PRODUCT_DISCOUNT) {
      discount = ProductDiscountMap[curItem.id as keyof typeof ProductDiscountMap] ?? discount;
    }

    totalAmt += itemTotal * (1 - discount);
  }
  return totalAmt;
};
