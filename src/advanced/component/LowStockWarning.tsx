import React from 'react';
import { Product } from '../type/type';

export const LowStockWarning = ({ products }: { products: Product[] }) => {
  return (
    <div id='stock-status' className='text-sm text-gray-500 mt-2 flex flex-col whitespace-pre-wrap'>
      {products.map((product) => (
        <div key={product.id}>
          {product.name}: {product.quantity > 0 ? `${product.quantity}개 남음` : '품절'}
        </div>
      ))}
    </div>
  );
};
