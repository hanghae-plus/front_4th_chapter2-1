import { createElement as h } from '../utils/createElement';

export const Discount = (discountRate: number) => {
  return h('span', {
    className: 'text-green-500 ml-2',
    textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
  });
};
