import { cartStore } from '@/stores/cartStore';

import { createElement } from '@utils/createElement';

import CartItem from './CartItem';

const CartList = (): HTMLDivElement => {
  const container = createElement('div', {
    id: 'cart-items',
  });

  const render = () => {
    const productList = cartStore.get('productList');

    container.innerHTML = '';
    productList.forEach((product) => {
      container.appendChild(CartItem(product));
    });
  };

  render();
  cartStore.subscribe('productList', render);

  return container;
};

export default CartList;
