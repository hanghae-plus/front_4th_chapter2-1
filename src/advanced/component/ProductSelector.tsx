import React from 'react';
import { productData } from '../../basic/data/data';
import { Product } from '../type/type';

export const ProductSelector = ({
  setSelectedProduct
}: {
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}) => {
  return (
    <select
      id="product-select"
      className="border rounded p-2 mr-2"
      onChange={(e) => {
        const selectedProduct = productData.find(
          (product) => product.id === e.target.value
        );
        setSelectedProduct(selectedProduct ?? null);
      }}
    >
      <option value="">상품을 선택하세요</option>
      {productData.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};
