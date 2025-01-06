import { Product } from '../types/product';
import { createElement } from '../utils/dom.ts';

export const updateProductSelectOptions = ($select: HTMLSelectElement, prodList: Product[]) => {
  $select.innerHTML = '';

  prodList.forEach(function (item) {
    const $option = createElement('option', {
      value: item.id,
      textContent: item.name + ' - ' + item.val + '원',
    }) as HTMLOptionElement;

    if (item.q === 0) $option.disabled = true;

    $select.appendChild($option);
  });
};
