import { CartItem } from './cart-item/CartItem';
import { CartStore } from '../../store/cartStore';

export const Cart = () => {
  const { actions } = CartStore;

  const cartList = actions.getCartList();

  const render = `
      <div>
          <h1 class="text-2xl font-bold mb-4">장바구니</h1>
          <div id="cart-items">
          ${cartList && cartList.map((item) => CartItem(item).render)}
          </div>
      </div>
      `;

  return { render };
};
