import React from 'react';
import { Product } from '../type/type';

export const AddToCartButton = ({
  products,
  selectedProduct,
  setCartItems,
  setProducts,
}: {
  products: Product[];
  selectedProduct: Product | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
}) => {
  const product = products.find((p) => p.id === selectedProduct?.id);
  const handleAddToCart = () => {
    if (!product) return;
    if (product.quantity <= 0) {
      alert('재고가 없습니다.');
      return;
    }
    if (selectedProduct && selectedProduct.quantity > 0) {
      setCartItems((prev) => [...prev, selectedProduct]);
      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, quantity: p.quantity - 1 } : p)),
      );
    }
  };

  return (
    <button
      id='add-to-cart'
      className='bg-blue-500 text-white px-4 py-2 rounded-md'
      onClick={handleAddToCart}
    >
      장바구니 추가
    </button>
  );
};
