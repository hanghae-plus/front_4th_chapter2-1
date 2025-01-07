import { cartStore } from '@/stores/cartStore';

import { createElement } from '@utils/createElement';

const ProductSelect = () => {
  const productSelect = document.getElementById('product-select');

  if (!productSelect) return;

  const updateOptions = () => {
    productSelect.innerHTML = '';
    const productList = cartStore.get('productList');

    productList.forEach((product) => {
      const option = createElement(
        'option',
        {
          value: product.id,
          disabled: product.volume === 0 ? 'true' : undefined,
        },
        `${product.name} - ${product.price}원`
      );

      productSelect.appendChild(option);
    });
  };

  updateOptions();
  cartStore.subscribe('productList', updateOptions);

  return productSelect;
};

export default ProductSelect;
