import { cartStore } from '@/basic/stores/cartStore';
import { createElement } from '@/basic/utils/createElement';

export const Stock = (): HTMLDivElement => {
  const container = createElement('div', {
    id: 'stock-status',
    class: 'text-sm text-gray-500 mt-2',
  });

  const render = () => {
    const productList = cartStore.get('productList');

    container.innerHTML = productList
      .filter((product) => product.stock < 5)
      .map(
        (product) =>
          `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}`
      )
      .join('\n');
  };

  render();
  cartStore.subscribe('productList', render);

  return container;
};

export default Stock;
