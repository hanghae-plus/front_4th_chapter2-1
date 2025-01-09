import { CartStore } from '../../../store/cartStore';
import { ProductStore } from '../../../store/productStore';
import { isQuantityCountOver } from '../../hooks/useQuantityChecker';

interface CartItemProps {
  id: string;
  name: string;
  amount: number;
  quantity: number;
}

let isQuantityChangeEventListenerAdded = false;
let isRemoveCartEventListenerAdded = false;

export const CartItem = (item: CartItemProps) => {
  const { id, name, amount } = item;

  const { actions: productActions } = ProductStore;
  const { actions: cartActions } = CartStore;

  const productList = productActions.getProductList();

  const cartCount = cartActions.getCartItem(id)?.quantity;

  if (!isQuantityChangeEventListenerAdded) {
    addEventListener('click', function (event) {
      const target = (event as MouseEvent).target;

      if (!target) return;

      if (target instanceof HTMLButtonElement && target.classList.contains('quantity-change')) {
        const prodId = target.dataset.productId;
        const compareTarget = target.dataset.change === '1' ? 'increase' : 'decrease';

        if (!prodId) return;

        if (compareTarget === 'increase') {
          if (isQuantityCountOver(item, 0)) {
            return;
          }

          productActions.decreaseQuantity(item.id);
          cartActions.addCartItem(item);
        } else {
          productActions.increaseQuantity(item.id);
          cartActions.removeCartItem(item.id);
        }
      }
    });

    isQuantityChangeEventListenerAdded = true;
  }

  // INFO: 삭제 버튼
  if (!isRemoveCartEventListenerAdded) {
    addEventListener('click', function (event) {
      const target = (event as MouseEvent).target;

      if (!productList) return;

      if (target instanceof HTMLButtonElement && target.classList.contains('remove-item')) {
        cartActions.clearCartItem(id);
      }
    });
    isRemoveCartEventListenerAdded = true;
  }

  const render = `
        <div id=${id} class="flex justify-between items-center mb-2">
            <span>
             ${name} - ${amount}원 x ${cartCount}
            </span>
            <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
            </div>
        </div>
      `;

  return { render };
};
