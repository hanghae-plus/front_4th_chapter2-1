import { CartItems } from './CartItems';
import { Header } from './Header';
import { createAddButtonElement } from '../renders/addButton';
import { createCartTotalElement } from '../renders/cartTotal';
import { createProductSelectElement } from '../renders/productSelect';
import { createStockStatusElement } from '../renders/stockStatus';

export const Wrap = () => {
  const PRODUCT_LIST = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];

  const CART_ITEMS = new Set();

  return `
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${Header()}
      ${CartItems({ cartItems: CART_ITEMS, productList: PRODUCT_LIST })}
      ${createCartTotalElement().outerHTML}
      ${createProductSelectElement().outerHTML}
      ${
        createAddButtonElement({
          cartItems: CART_ITEMS,
          productList: PRODUCT_LIST,
        }).outerHTML
      }
      ${createStockStatusElement().outerHTML}
    </div>
  `;
};
