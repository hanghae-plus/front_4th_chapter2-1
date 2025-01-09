import React from 'react';
import { Product } from '../type/type';

export const AddToCart = ({
  selectedProduct,
  setCartItems
}: {
  selectedProduct: Product | null;
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
}) => {
  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
      onClick={() => {
        if (selectedProduct) {
          setCartItems((prev) => [...prev, selectedProduct]);
        }
      }}
    >
      장바구니 추가
    </button>
  );
};
