import React from 'react';
import { Product } from '../types';
import { UI_CLASSES } from '../constants';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  return (
    <select
      className={UI_CLASSES.SELECT}
      onChange={(e) => {
        const product = products.find((p) => p.id === e.target.value);
        if (product) onProductSelect(product);
      }}
    >
      {products.map((product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};
