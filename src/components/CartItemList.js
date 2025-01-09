import { CartItem } from './CartItem.js';
import { useCart } from '../hooks/useCart.js';

export function CartItemList() {
  const element = document.createElement('ul');

  const render = () => {
    const { getCart } = useCart();
    const cart = getCart();

    element.innerHTML = '';

    cart.forEach((item) => {
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
