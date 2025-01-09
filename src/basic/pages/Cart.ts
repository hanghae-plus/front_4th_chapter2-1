import CartTotal from '@/components/CartTotal';
import ProductSelect from '@/components/ProductSelect';
import Stock from '@/components/Stock';
import { createElement } from '@/utils/createElement';

import AddToCartButton from '@components/AddToCartButton';
import CartList from '@components/CartList';
import { additionalSale, randomSale } from '@utils/saleEvent';

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

  subContainer.append(header, CartList(), ProductSelect(), AddToCartButton(), Stock(), CartTotal());
  container.appendChild(subContainer);
  root!.appendChild(container);

  randomSale();
  additionalSale();
};

export default Cart;
