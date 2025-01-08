import { createElement } from '../core/createElement.js';
import {
  addToCart,
  handleCartItemDelete,
  updateCartItemQuantity
} from '../logic/cartLogic.js';

export const CartHeader = () => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니'
  });
};

export const CartItems = () => {
  return createElement('div', {
    id: 'cart-items'
  });
};

export const DisplayPoint = () => {
  return createElement('span', {
    id: 'loyalty-points',
    className: 'text-blue-500 ml-2',
    textContent: '(포인트: 0)'
  });
};

export const CartTotal = () => {
  const container = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4'
  });

  const totalText = createElement('span', {
    textContent: '총액: 0원'
  });
  const pointDisplay = DisplayPoint();

  console.log('111', pointDisplay);

  container.append(totalText, pointDisplay);
  console.log('222', container);
  return container;
};

export const QuantityButton = (itemId, isIncrease, label) => {
  return createElement('button', {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    'data-product-id': itemId,
    'data-change': isIncrease ? 1 : -1,
    textContent: label,
    onclick: () => updateCartItemQuantity(itemId, isIncrease)
  });
};

export const RemoveButton = (itemId) => {
  return createElement('button', {
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    'data-product-id': itemId,
    textContent: '삭제',
    onclick: () => handleCartItemDelete(itemId)
  });
};

export const CartItem = (itemToAdd) => {
  const itemSpan = createElement('span', {
    textContent: `${itemToAdd.name} - ${itemToAdd.price}원 x 1`
  });

  const buttonContainer = createElement('div', {});

  const minusButton = QuantityButton(itemToAdd.id, false, '-');
  const plusButton = QuantityButton(itemToAdd.id, true, '+');
  const removeButton = RemoveButton(itemToAdd.id);

  buttonContainer.append(minusButton, plusButton, removeButton);

  const container = createElement('div', {
    id: itemToAdd.id,
    className: 'flex justify-between items-center mb-2'
  });

  container.append(itemSpan, buttonContainer);

  return container;
};

export const AddToCartButton = () => {
  return createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    onclick: () => addToCart()
  });
};
