import Product from '../types/product.ts';
import { formatMessage } from './stockUtils.ts';

interface StockProps {
  productList: Product[];
}

const Stock = ({ productList }: StockProps) => {
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {productList
        .map((product) => {
          return `${product.name}: ${formatMessage(product.quantity)}`;
        })
        .join(' ')}
    </div>
  );
};

export default Stock;
