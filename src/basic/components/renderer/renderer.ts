import { createElement } from '../../utils/createElement';
import { $ } from '../../utils/dom.utils';

import type { Product } from '../../types/product.type';

function createSelectOptions(products: Product[]): HTMLOptionElement[] {
  return products.map((product) => {
    const opt = createElement<HTMLOptionElement>('option');

    opt.value = product.id;
    opt.textContent = `${product.name} - ${product.originalPrice}원`;
    if (product.quantity === 0) opt.disabled = true;

    return opt;
  });
}

export function renderSelectOptions(products: Product[]) {
  const $ProductSelect = $<HTMLSelectElement>('#product-select');

  $ProductSelect.innerHTML = '';
  const productOptions = createSelectOptions(products);

  productOptions.forEach((option) => {
    $ProductSelect.appendChild(option);
  });
}
