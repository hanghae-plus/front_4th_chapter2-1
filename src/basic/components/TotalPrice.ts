import { createElement as h } from '../utils/createElement';

export const TotalPrice = () => {
  return h('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
};
