import { createElement } from '../core/createElement.js';
import { addToCart } from '../logic/logic.js';

export const CartHeader = () => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
};

export const CartItems = () => {
  const cartItems = createElement('div', {
    id: 'cart-items',
  });

  return cartItems;
};

export const CartTotal = () => {
  return createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
    textContent: '총액: 0원(포인트: 0)',
  });
};

const QuantityButton = (itemId, change, label) => {
  return createElement('button', {
    className: `quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1`,
    'data-product-id': itemId,
    'data-change': change,
    textContent: label,
    onclick: () => {
      const selectedOptions = document.getElementById('product-select');
      const cartDisplay = document.getElementById('cart-items');
      addToCart(cartDisplay, selectedOptions);
    },
  });
};

const RemoveButton = (itemId) => {
  return createElement('button', {
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    'data-product-id': itemId,
    textContent: '삭제',
  });
};

export const CartItem = (itemToAdd) => {
  const itemSpan = createElement('span', {
    textContent: `${itemToAdd.name} - ${itemToAdd.price}원 x 1`,
  });

  const buttonContainer = createElement('div', {});

  const minusButton = QuantityButton(itemToAdd.id, -1, '-');
  const plusButton = QuantityButton(itemToAdd.id, 1, '+');
  const removeButton = RemoveButton(itemToAdd.id);

  buttonContainer.append(minusButton, plusButton, removeButton);

  const container = createElement('div', {
    id: itemToAdd.id,
    className: 'flex justify-between items-center mb-2',
  });

  container.append(itemSpan, buttonContainer);

  return container;
};

export const AddToCartButton = () => {
  return createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    onclick: () => {
      const selectedOptions = document.getElementById('product-select');
      const cartDisplay = document.getElementById('cart-items');
      addToCart(cartDisplay, selectedOptions);
    },
  });
};
