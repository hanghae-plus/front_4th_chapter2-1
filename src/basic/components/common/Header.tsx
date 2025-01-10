import { createElement } from '@/basic/utils/createElement';

const Header = () => {
  const header = createElement(
    'h1',
    {
      class: 'text-2xl font-bold mb-4',
    },
    '장바구니'
  );

  return header;
};

export default Header;
