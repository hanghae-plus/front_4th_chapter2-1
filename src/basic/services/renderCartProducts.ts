import { CartProduct } from '../components/CartProducts';

import type { Product } from '../types/product.type';

export const renderCartProducts = ($cartProductsContainer: HTMLElement, cartItems: Product[]) => {
  if (cartItems.length === 0) {
    $cartProductsContainer.innerHTML = '';

    return;
  }
  cartItems.forEach((item) => {
    const existingItem = $cartProductsContainer.querySelector(`#${item.id}`);

    if (existingItem) {
      existingItem.querySelector('span').textContent =
        `${item.name} - ${item.originalPrice}원 x ${item.quantity}`;
    } else {
      $cartProductsContainer.appendChild(CartProduct(item));
    }
  });
};
