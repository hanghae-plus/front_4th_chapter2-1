import { createElement } from './createElement';

import type { Product } from '../types/product.type';

function createSelectOptions(products: Product[]): HTMLOptionElement[] {
  return products.map((product) => {
    const opt = createElement<HTMLOptionElement>('option');

    opt.value = product.id;
    opt.textContent = product.name + ' - ' + product.originalPrice + '원';
    if (product.quantity === 0) opt.disabled = true;

    return opt;
  });
}

export function updateSelectOptions($select: HTMLSelectElement, products: Product[]) {
  $select.innerHTML = '';
  const productOptions = createSelectOptions(products);

  productOptions.forEach((option) => {
    $select.appendChild(option);
  });
}
