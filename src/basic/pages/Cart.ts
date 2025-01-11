import AddToCartButton from '@/basic/components/AddToCartButton';
import CartList from '@/basic/components/CartList';
import CartTotal from '@/basic/components/CartTotal';
import Header from '@/basic/components/common/Header';
import ProductSelect from '@/basic/components/ProductSelect';
import Stock from '@/basic/components/Stock';
import { additionalSale, randomSale } from '@/basic/utils/saleEvent';

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
