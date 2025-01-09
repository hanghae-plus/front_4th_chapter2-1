import CartTotal from '@/components/CartTotal';
import ProductSelect from '@/components/ProductSelect';
import Stock from '@/components/Stock';
import { cartStore } from '@/stores/cartStore';
import { createElement } from '@/utils/createElement';

import AddToCartButton from '@components/AddToCartButton';
import CartList from '@components/CartList';

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

  setTimeout(() => {
    setInterval(() => {
      const productList = cartStore.get('productList');
      const randomProduct = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && randomProduct.stock > 0) {
        cartStore.set(
          'productList',
          productList.map((p) =>
            p.id === randomProduct.id ? { ...p, price: Math.round(p.price * 0.8) } : p
          )
        );

        alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      const lastSaleItem = cartStore.get('lastSaleItem');
      const productList = cartStore.get('productList');

      if (lastSaleItem) {
        const suggestedProduct = productList.find(
          (item) => item.id !== lastSaleItem && item.stock > 0
        );

        if (suggestedProduct) {
          alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

          cartStore.set(
            'productList',
            productList.map((p) =>
              p.id === suggestedProduct.id ? { ...p, price: Math.round(p.price * 0.95) } : p
            )
          );
        }
      }
    }, 60000);
  }, Math.random() * 10000);
};

export default Cart;
