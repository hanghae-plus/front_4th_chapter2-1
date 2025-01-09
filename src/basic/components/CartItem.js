import { useCart } from '../hooks/useCart.js';

export function CartItem({ product, quantity }) {
  const element = document.createElement('div');
  element.className = 'flex justify-between items-center mb-2';
  element.id = product.id;
  const { updateItemQuantity, removeFromCart } = useCart();

  const render = () => {
    element.innerHTML = `
     <span>${product.name} - ${product.price}원 x ${quantity}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${product.id} data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${product.id} data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded">삭제</button>
      </div>
    `;

    element
      .querySelector('.remove-item')
      .addEventListener('click', () => removeFromCart(product.id));

    const quantityButtons = element.querySelectorAll('.quantity-change');
    quantityButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const change = parseInt(button.dataset.change); // +1 또는 -1
        updateItemQuantity(button.dataset.productId, change);
      });
    });
  };

  return {
    getElement: () => element,
    render,
  };
}
