import { cartStore } from '@/stores/cartStore';

import ProductSelect from '@components/ProductSelect';
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

  ProductSelect();

  addToCartButton.addEventListener('click', () => {
    const selectedId = productSelect.value;
    const productList = cartStore.get('productList');
    const itemToAdd = productList.find((p) => p.id === selectedId);

    if (itemToAdd && itemToAdd.volume > 0) {
      const item = document.getElementById(itemToAdd.id);

      if (item) {
        const span = item.querySelector('span');

        if (!span?.textContent) return;

        const newQty = parseInt(span.textContent.split('x ')[1]) + 1;

        if (newQty <= itemToAdd.volume) {
          item.querySelector('span')!.textContent =
            `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;

          cartStore.set(
            'productList',
            productList.map((p) => (p.id === selectedId ? { ...p, volume: p.volume - 1 } : p))
          );
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = document.createElement('div');

        newItem.id = itemToAdd.id;
        newItem.className = 'flex justify-between items-center mb-2';
        newItem.innerHTML =
          `<span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span><div>` +
          `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>` +
          `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>` +
          `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button></div>`;
        cartItems.appendChild(newItem);

        cartStore.set(
          'productList',
          productList.map((p) => (p.id === selectedId ? { ...p, volume: p.volume - 1 } : p))
        );
      }
      cartStore.set('lastSaleItem', selectedId);
    }
  });
};

export default Cart;
