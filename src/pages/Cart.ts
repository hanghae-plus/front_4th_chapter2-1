import { createElement } from '@utils/createElement';

const Cart = () => {
  const root = document.getElementById('app');

  const container = createElement('div', {
    class: 'bg-gray-100 p-8',
  });

  const subContainer = createElement('div', {
    class: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const header = createElement(
    'h1',
    {
      class: 'text-2xl font-bold mb-4',
    },
    '장바구니'
  );

  const cartItems = createElement('div', {
    id: 'cart-items',
  });

  const cartTotal = createElement('div', {
    id: 'cart-total',
    class: 'text-xl font-bold my-4',
  });

  const productSelect = createElement('select', {
    id: 'product-select',
    class: 'border rounded p-2 mr-2',
  });

  const addToCartButton = createElement(
    'button',
    {
      id: 'add-to-cart',
      class: 'bg-blue-500 text-white px-4 py-2 rounded',
    },
    '추가'
  );

  const stockStatus = createElement('div', {
    id: 'stock-status',
    class: 'text-sm text-gray-500 mt-2',
  });

  subContainer.append(header, cartItems, cartTotal, productSelect, addToCartButton, stockStatus);
  container.appendChild(subContainer);
  root!.appendChild(container);
};

export default Cart;
