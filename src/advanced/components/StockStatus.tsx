import { useProductsStore } from '../store/useProductsStore';

export const StockStatus = () => {
  const { products } = useProductsStore();
  return (
    <div className='mt-2 text-sm text-gray-500'>
      {products.map((product) => {
        if (product.stock < 5) {
          return (
            <div>
              {`${product.name}: ${product.stock > 0 ? '재고 부족 (' + product.stock + '개 남음)' : '품절'}`}
            </div>
          );
        }
      })}
    </div>
  );
};
