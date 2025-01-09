import { createElement as h } from '../utils/createElement';

export const Header = () => {
  return h('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
};
