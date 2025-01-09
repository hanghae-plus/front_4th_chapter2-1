import React from 'react';
import { Product } from '../type/type';

export const ProductSelector = ({
  setSelectedProduct,
  products,
}: {
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  products: Product[];
}) => {
  return (
    <select
      id='product-select'
      className='border rounded p-2 mr-2'
      onChange={(e) => {
        const selectedProduct = products.find((product) => product.id === e.target.value);
        setSelectedProduct(selectedProduct ?? null);
      }}
    >
      <option value={''}>상품을 선택하세요</option>
      {products.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};
