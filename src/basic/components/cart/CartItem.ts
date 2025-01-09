import { Product } from '@/types/types';

import { createElement } from '@utils/createElement';

const CartItem = (itemToAdd: Product): HTMLDivElement => {
  const container = createElement('div', {
    id: itemToAdd.id,
    class: 'flex justify-between items-center mb-2',
  });

  const render = () => {
    container.innerHTML =
      `<span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span><div>` +
      `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>` +
      `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>` +
      `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button></div>`;
  };

  render();

  return container;
};

export default CartItem;
