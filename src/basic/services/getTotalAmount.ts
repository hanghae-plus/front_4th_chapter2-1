import { getQuantityFromItemNode } from './getQuantityFromItemNode.ts';
import { Product } from '../types/product';

export const getTotalAmount = (productList: Product[], $cartItems: HTMLOptionElement[]) => {
  return Array.from($cartItems).reduce((acc, $cartItem) => {
    const curItem = productList.find((prod) => prod.id === $cartItem.id)!;

    const quantity = getQuantityFromItemNode($cartItem);

    return acc + curItem.val * quantity;
  }, 0);
};
