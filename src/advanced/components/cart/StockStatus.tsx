import React from 'react';
import { Product } from '../../types/Product';
import { useCartStore } from '../../stores/cartStore';

export const StockStatus = () => {
  const { productList } = useCartStore((state) => state);

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {productList.map((product: Product) => {
        let message = '';
        if (product.quantity < 5) {
          message +=
            product.name +
            ': ' +
            (product.quantity > 0 ? '재고 부족 (' + product.quantity + '개 남음)' : '품절') +
            '\n';
        }
        return <div key={product.id}>{message}</div>;
      })}
    </div>
  );
};
