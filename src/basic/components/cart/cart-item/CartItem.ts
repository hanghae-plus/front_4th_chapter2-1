import { CartStore } from '../../../store/cartStore';
import { ProductStore } from '../../../store/productStore';
import { isQuantityCountOver } from '../../hooks/useQuantityChecker';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const eventHandlers = {
  quantityChange: null as ((e: Event) => void) | null,
  removeCart: null as ((e: Event) => void) | null,
};

export const CartItem = (item: CartItemProps) => {
  const { id, name, price, quantity } = item;

  const { actions: productActions } = ProductStore;
  const { actions: cartActions } = CartStore;

  const productList = productActions.getProductList();

  if (eventHandlers.quantityChange) {
    removeEventListener('click', eventHandlers.quantityChange);
  }
  if (eventHandlers.removeCart) {
    removeEventListener('click', eventHandlers.removeCart);
  }

  eventHandlers.quantityChange = function (event: Event) {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLButtonElement && target.classList.contains('quantity-change')) {
      const prodId = target.dataset.productId;
      const compareTarget = target.dataset.change === '1' ? 'increase' : 'decrease';

      if (!prodId) return;

      if (compareTarget === 'increase') {
        if (isQuantityCountOver(item, 0, productList)) {
          return;
        }
        productActions.decreaseQuantity(item.id);
        cartActions.addCartItem(item);
      } else {
        productActions.increaseQuantity(item.id);
        cartActions.removeCartItem(item.id);
      }
    }
  };

  eventHandlers.removeCart = function (event: Event) {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLButtonElement && target.classList.contains('remove-item')) {
      const clickedId = target.dataset.productId;
      if (clickedId === id) {
        cartActions.clearCartItem(id);
      }
    }
  };

  addEventListener('click', eventHandlers.quantityChange);
  addEventListener('click', eventHandlers.removeCart);

  const render = `
        <div id=${id} class="flex justify-between items-center mb-2">
            <span>
             ${name} - ${price}원 x ${quantity}
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
