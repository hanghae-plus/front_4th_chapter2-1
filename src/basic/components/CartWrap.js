import { AddToCartButton } from './AddToCartButton';
import { CartItems } from './CartItems';
import { CartTotal } from './CartTotal';
import { Header } from './Header';
import { ProductSelect } from './ProductSelect';
import { StockStatus } from './StockStatus';

export const CartWrap = () => {
  const PRODUCT_LIST = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  const CART_ITEMS = new Set();

  return `
    <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      ${Header()}
      ${CartItems({ cartItems: CART_ITEMS })}
      ${CartTotal()}
      ${ProductSelect({ productList: PRODUCT_LIST })}
      ${AddToCartButton({ productList: PRODUCT_LIST, cartItems: CART_ITEMS })}
      ${StockStatus()}
    </div>
  `;
};
