import { createElement } from '../utils/dom.ts';

export const $addButton = createElement('button', {
  id: 'add-to-cart',
  className: 'bg-blue-500 text-white px-4 py-2 rounded',
  textContent: '추가',
});
