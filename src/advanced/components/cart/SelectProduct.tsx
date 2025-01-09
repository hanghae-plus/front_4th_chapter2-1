import React, { useState } from 'react';
import { Product } from '../../types/Product';
import { Option } from './Option.js';
import { useCartStore } from '../../stores/cartStore';

export const SelectProduct = () => {
  const { productList, setSelectedProduct, addToCart } = useCartStore((state) => state);

  const [selectedProductId, setSelectedProductId] = useState<string>(productList[0]?.id || '');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedProductId(selectedId);
    setSelectedProduct(selectedId);
  };

  const handleAddToCart = () => {
    if (selectedProductId) {
      addToCart(selectedProductId);
    }
  };

  return (
    <div>
      <select
        data-testid="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProductId}
        onChange={handleSelectChange}
      >
        {productList.map((product: Product) => (
          <Option
            key={product.id}
            itemId={product.id}
            itemName={product.name}
            itemPrice={product.price}
            itemQuantity={product.quantity}
          />
        ))}
      </select>
      <button
        data-testid="add-to-cart-button"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCart}
      >
        추가
      </button>
    </div>
  );
};
