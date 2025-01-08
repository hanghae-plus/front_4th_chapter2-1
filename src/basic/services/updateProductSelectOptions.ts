import { createElement } from '../utils/dom.ts';
import { productStore } from '../stores/productStore.ts';

export const updateProductSelectOptions = ($select: HTMLSelectElement) => {
  const productList = productStore.getState();

  $select.innerHTML = '';

  productList.forEach(function (item) {
    const $option = createElement('option', {
      value: item.id,
      textContent: item.name + ' - ' + item.val + '원',
    }) as HTMLOptionElement;

    if (item.q === 0) $option.disabled = true;

    $select.appendChild($option);
  });
};
