import { useCartActionsContext } from '../contexts/CartProvider';
import { useProductsStateContext } from '../contexts/ProductsProvider';

const StockInfo = () => {
  const { products } = useProductsStateContext('StockInfo');
  const { getItem } = useCartActionsContext('StockInfo');

  return (
    <div className="mt-2 text-sm text-gray-500">
      {products.map((product) => {
        const item = getItem(product.id);
        const remainingStock = product.stock - (item?.quantity || 0);
        return remainingStock < 5
          ? remainingStock > 0
            ? `${product.name}: 재고 부족 (${remainingStock}개 남음) \n`
            : `${product.name}: 품절 \n`
          : null;
      })}
    </div>
  );
};

export default StockInfo;
