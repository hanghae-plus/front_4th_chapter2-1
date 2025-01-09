import { useCart } from '../state/useCart.js';

export function CartItem({ product, quantity }) {
  const element = document.createElement('div');
  element.className = 'flex justify-between items-center mb-2';
  const { updateItemQuantity, removeFromCart } = useCart();

  const render = () => {
    element.innerHTML = `
     <span>${product.name} - ${product.price}원 x ${quantity}</span>
      <div>
        <button class="quantity-decrease bg-blue-500 text-white px-2 py-1 rounded mr-1">-</button>
        <button class="quantity-increase bg-blue-500 text-white px-2 py-1 rounded mr-1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded">삭제</button>
      </div>
    `;

    element
      .querySelector('.quantity-decrease')
      .addEventListener('click', () => updateItemQuantity(product.id, -1));
    element
      .querySelector('.quantity-increase')
      .addEventListener('click', () => updateItemQuantity(product.id, 1));
    element
      .querySelector('.remove-item')
      .addEventListener('click', () => removeFromCart(product.id));
  };

  return {
    getElement: () => element,
    render,
  };
}
