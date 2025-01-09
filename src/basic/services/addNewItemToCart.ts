import { Product } from '../types/product';
import { createCartItemNameValueQuantityTemplate } from './createCartItemNameValueQuantityTemplate.ts';

export const addNewItemToCart = ($cartDisplay: HTMLElement, itemToAdd: Product) => {
  const $newItem = document.createElement('div');

  $newItem.id = itemToAdd.id;
  $newItem.className = 'flex justify-between items-center mb-2';

  $newItem.innerHTML = `${createCartItemNameValueQuantityTemplate(itemToAdd.name, itemToAdd.val)}
<div>
  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
    data-product-id="${itemToAdd.id}" 
    data-change="-1">-</button>
  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
    data-product-id="${itemToAdd.id}" 
    data-change="1">+</button>
  <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
    data-product-id="${itemToAdd.id}">삭제</button>
</div>`;

  $cartDisplay.appendChild($newItem);
};
