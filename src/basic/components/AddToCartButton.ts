import { cartStore } from '@/stores/cartStore';
import { createElement } from '@/utils/createElement';

import { calcCart } from '@hooks/calcCart';

const AddToCartButton = (): HTMLButtonElement => {
  const addToCartButton = createElement(
    'button',
    {
      id: 'add-to-cart',
      class: 'bg-blue-500 text-white px-4 py-2 rounded',
    },
    '추가'
  ) as HTMLButtonElement;

  addToCartButton.addEventListener('click', () => {
    const productSelect = document.getElementById('product-select') as HTMLSelectElement;

    if (!productSelect) return;

    const selectedId = productSelect.value;
    const productList = cartStore.get('productList');
    const itemToAdd = productList.find((p) => p.id === selectedId);

    if (itemToAdd && itemToAdd.stock > 0) {
      const item = document.getElementById(itemToAdd.id);

      if (item) {
        const span = item.querySelector('span');

        if (!span?.textContent) return;

        const newQty = parseInt(span.textContent.split('x ')[1]) + 1;

        if (newQty <= itemToAdd.stock) {
          item.querySelector('span')!.textContent =
            `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;

          cartStore.set(
            'productList',
            productList.map((p) => (p.id === selectedId ? { ...p, stock: p.stock - 1 } : p))
          );
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newItem = createElement('div', {
          id: itemToAdd.id,
          class: 'flex justify-between items-center mb-2',
        });

        newItem.innerHTML =
          `<span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span><div>` +
          `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>` +
          `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>` +
          `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button></div>`;

        const cartItems = document.getElementById('cart-items');

        cartItems?.appendChild(newItem);

        cartStore.set(
          'productList',
          productList.map((p) => (p.id === selectedId ? { ...p, stock: p.stock - 1 } : p))
        );
      }

      cartStore.set('lastSaleItem', selectedId);
    }
    calcCart();
  });

  return addToCartButton;
};

export default AddToCartButton;
