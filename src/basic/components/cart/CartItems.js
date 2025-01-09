import { productStore } from '../../stores/productStore.js';
import { addEvent } from '../../lib/eventManager.js';

export const CartItems = () => {
  const { cartList } = productStore.getState();

  return `<div id="cart-items">${cartList.map((item) => ItemRow(item)).join('')}</div>`;
};

function ItemRow(item) {
  addEvent('click', `#minus-product-${item.id}`, () => {
    productStore.actions.updateQuantity(item.id, -1);
  });

  addEvent('click', `#plus-product-${item.id}`, () => {
    productStore.actions.updateQuantity(item.id, 1);
  });

  addEvent('click', `#remove-product-${item.id}`, () => {
    productStore.actions.removeToCart(item.id);
  });

  return `<div id="${item.id}" class="flex justify-between items-center mb-2">
  <span>${item.name} - ${item.price}원 x ${item.quantity}</span>
  <div>
    <button id="minus-product-${item.id}" class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
    <button id="plus-product-${item.id}" class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
    <button id="remove-product-${item.id}" class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
  </div>
  </div>`;
}
