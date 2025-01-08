import { createElement as h } from '../utils/createElement';

export const AddToCartButton = () => {
  return h('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
};
