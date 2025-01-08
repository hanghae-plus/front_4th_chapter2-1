import { getQuantityFromItemNode } from './getQuantityFromItemNode.ts';

export const getAllItemAmount = ($cartItems: HTMLOptionElement[]) => {
  return Array.from($cartItems).reduce((acc, $cartItem) => {
    const quantity = getQuantityFromItemNode($cartItem);
    return acc + quantity;
  }, 0);
};
