import { cartStore } from '@/basic/stores/cartStore';
import { createElement } from '@/basic/utils/createElement';

export const ProductSelect = (): HTMLSelectElement => {
  const container = createElement('select', {
    id: 'product-select',
    class: 'border rounded p-2 mr-2',
  }) as HTMLSelectElement;

  const render = () => {
    const productList = cartStore.get('productList');

    container.innerHTML = productList
      .map(
        (product) =>
          `<option value="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>`
      )
      .join('');
  };

  render();
  cartStore.subscribe('productList', render);

  return container;
};

export default ProductSelect;
