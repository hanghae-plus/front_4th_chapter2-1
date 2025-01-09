import { cartStore } from '@/stores/cartStore';
import { PRODUCT_SELECT } from '@/types/constant';
import { createElement } from '@/utils/createElement';

export const ProductSelect = (): HTMLSelectElement => {
  const container = createElement('select', {
    id: 'product-select',
    class: 'border rounded p-2 mr-2',
  }) as HTMLSelectElement;

  const render = () => {
    container.innerHTML = PRODUCT_SELECT.map(
      (product) =>
        `<option value="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>${product.name} - ${product.price}원</option>`
    ).join('');
  };

  render();
  cartStore.subscribe('productList', render);

  return container;
};

export default ProductSelect;
