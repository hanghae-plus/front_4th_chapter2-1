import { AddToCartButton } from './AddToCartButton';
import { CartProductList } from './CartProductList';
import { Header } from './Header';
import { ProductSelect } from './ProductSelect';
import { StockStatus } from './StockStatus';
import { TotalPrice } from './TotalPrice';
import { createElement as h } from '../utils/createElement';

export const Main = () => {
  return h<HTMLDivElement>(
    'div',
    {
      className: 'bg-gray-100 p-8',
    },
    [Container()]
  );
};

export const Container = () => {
  return h<HTMLDivElement>(
    'div',
    {
      className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    },
    [Header(), CartProductList(), TotalPrice(), ProductSelect(), AddToCartButton(), StockStatus()]
  );
};
