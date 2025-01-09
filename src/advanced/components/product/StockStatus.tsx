import { Product } from '../../types/product';

interface StockStatusProps {
  products: Product[];
  lowStockThreshold: number;
}

const StockStatus: React.FC<StockStatusProps> = ({ products, lowStockThreshold }) => (
  <div id='stock-status' className='text-sm text-gray-500 mt-2'>
    {products
      .filter((product) => product.stockQuantity < lowStockThreshold)
      .map((product) => (
        <div key={product.id}>
          {product.name}:{' '}
          {product.stockQuantity > 0 ? `재고 부족 (${product.stockQuantity}개 남음)` : '품절'}
        </div>
      ))}
  </div>
);

export default StockStatus;
