import React from 'react';
import { ProductItemType } from '../types';

interface ProductSelectorProps {
  products: ProductItemType[];
  selectedProductId: string | null;
  onProductChange: (productId: string) => void;
  onAddToCart: () => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onProductChange,
  onAddToCart,
}) => (
  <div>
    <select
      id='product-select'
      className='border rounded p-2 mr-2'
      value={selectedProductId || ''}
      onChange={(e) => onProductChange(e.target.value)}
    >
      {products.map((item) => (
        <option key={item.id} value={item.id} disabled={item.quantity === 0}>
          {item.name} - {item.price}원
        </option>
      ))}
    </select>
    <button
      id='add-to-cart'
      className='bg-blue-500 text-white px-4 py-2 rounded'
      onClick={onAddToCart}
    >
      추가
    </button>
  </div>
);

export default ProductSelector;
