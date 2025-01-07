import { createElement } from '../../utils/createElement';

import type { Product } from '../../types/product.type';

const createCartItemDOM = (item: Product) => {
  return createElement('div', {
    id: item.id,
    className: 'flex justify-between items-center mb-2',
    innerHTML: `
    <span>${item.name} - ${item.originalPrice}원 x ${item.quantity}</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
    </div>
  `,
  });
};

export const renderCartProducts = ($cartProductsContainer: HTMLElement, cartItems: Product[]) => {
  if (cartItems.length === 0) {
    $cartProductsContainer.innerHTML = '';

    return;
  }
  cartItems.forEach((item) => {
    const existingItem = $cartProductsContainer.querySelector(`#${item.id}`);

    if (existingItem) {
      // 기존 아이템 업데이트
      existingItem.querySelector('span').textContent =
        `${item.name} - ${item.originalPrice}원 x ${item.quantity}`;
    } else {
      // 새 아이템 추가
      const newItem = createCartItemDOM(item);

      $cartProductsContainer.appendChild(newItem);
    }
  });
};
