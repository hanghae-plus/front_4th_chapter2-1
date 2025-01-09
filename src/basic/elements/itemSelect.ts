import { createElement } from '../utils/dom.ts';

export const $itemSelect = createElement('select', {
  id: 'product-select',
  className: 'border rounded p-2 mr-2',
});
