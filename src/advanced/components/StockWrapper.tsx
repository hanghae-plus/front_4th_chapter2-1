import Stock from './Stock.tsx';
import Product from '../types/product.ts';

interface StockWrapperProps {
  productList: Product[];
}

const StockWrapper = ({ productList }: StockWrapperProps) => {
  const filteredProductList = productList.filter(
    (product) => product.quantity === 0 || product.quantity < 5,
  );

  return <Stock productList={filteredProductList} />;
};

export default StockWrapper;
