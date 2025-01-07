import { createElement } from '../core/createElement.js';

export const CartHeader = () => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
};

export const CartItems = () => {
  return createElement('div', {
    id: 'cart-items',
  });
};

export const CartTotal = () => {
  return createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
    textContent: '총액: 0원(포인트: 0)',
  });
};
