import {
  handleDecreaseItem,
  handleIncreaseItem,
  handleRemoveItem
} from '../events/CartEventHandler';
import { state } from '../store/globalStore';

function CartList() {
  const container = document.createElement('div');

  const render = () => {
    const cartList = state.get('cartList');

    container.innerHTML = `
        <div id="cart-items" class="my-4">
          ${cartList
            .map(
              (item) => `
              <div id="${item.id}" class="flex justify-between items-center mb-2">
                <span>${item.name} - ${item.price}원 x ${item.volume}</span>
                <div>
                  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button>
                  <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button>
                  <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button>
                </div>
              </div>
            `
            )
            .join('')}
        </div>
  `;
    const increaseBtn = container.querySelectorAll('button[data-change="1"]');
    const decreaseBtn = container.querySelectorAll('button[data-change="-1"]');
    const removeBtn = container.querySelectorAll('.remove-item');

    increaseBtn.forEach((btn) => {
      btn.addEventListener('click', handleIncreaseItem);
    });

    decreaseBtn.forEach((btn) => {
      btn.addEventListener('click', handleDecreaseItem);
    });

    removeBtn.forEach((btn) => {
      btn.addEventListener('click', handleRemoveItem);
    });
  };

  state.subscribe('cartList', render);
  render();

  return container;
}

export default CartList;
