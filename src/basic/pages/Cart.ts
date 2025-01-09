import CartTotal from '@/components/CartTotal';
import ProductSelect from '@/components/ProductSelect';
import Stock from '@/components/Stock';

import AddToCartButton from '@components/AddToCartButton';
import CartList from '@components/CartList';
import Header from '@components/common/Header';
import { additionalSale, randomSale } from '@utils/saleEvent';

const Cart = () => {
  const root = document.getElementById('app');

  const render = () => {
    root!.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div id="wrap" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"></div>  
      </div>
    `;

    const wrap = document.getElementById('wrap');

    wrap!.append(Header(), CartList(), ProductSelect(), AddToCartButton(), Stock(), CartTotal());
  };

  render();
  randomSale();
  additionalSale();
};

export default Cart;
