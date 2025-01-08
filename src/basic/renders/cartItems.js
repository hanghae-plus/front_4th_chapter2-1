import { createCartItemElement } from './cartItem';

export const createCartItemsElement = () => {
  const $cartItems = document.createElement('div');
  $cartItems.id = 'cart-items';
  return $cartItems;
};

export const renderCartItems = ({ cartItems }) => {
  const $cartItems = document.getElementById('cart-items');
  $cartItems.innerHTML = '';

  cartItems.forEach((cartItem) => {
    const $cartItem = createCartItemElement({ cartItem });
    $cartItems.appendChild($cartItem);
  });
};
