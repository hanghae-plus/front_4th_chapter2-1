import { Product } from '../types/product';

interface UpdateCartItemQuantityParams {
  $exitingItemInCart: HTMLElement;
  itemToAdd: Product;
  updatedQuantity: number;
}

export const updateCartItemQuantity = ({
  $exitingItemInCart,
  itemToAdd,
  updatedQuantity,
}: UpdateCartItemQuantityParams) => {
  $exitingItemInCart.querySelector('span')!.textContent = `${itemToAdd.name} - ${itemToAdd.val}원 x ${updatedQuantity}`;
};
