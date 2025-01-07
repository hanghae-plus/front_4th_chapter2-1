import { createElement } from "../../utils/createElement";

export const Header = () => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
};
