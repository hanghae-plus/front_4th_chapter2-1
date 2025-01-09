import React from 'react';
import { productData } from '../../basic/data/data';

export const ProductSelector = () => {
  return (
    <select id="product-select" className="border rounded p-2 mr-2">
      {productData.map((product) => (
        <option value={product.id}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};
