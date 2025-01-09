import { CartItem } from './CartItem.js';

export function CartItemList({ cartItems }) {
  const element = document.createElement('ul');

  const render = () => {
    element.innerHTML = '';

    cartItems.forEach((item) => {
      const cartItem = CartItem({
        product: item.product,
        quantity: item.quantity,
      });

      cartItem.render();
      element.appendChild(cartItem.getElement());
    });
  };

  return {
    getElement: () => element,
    render,
  };
}
