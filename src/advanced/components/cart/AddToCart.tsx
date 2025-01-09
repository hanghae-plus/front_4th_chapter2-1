// components/cart/AddToCart.tsx
import React from 'react';
import { Product } from '../../types/product';

interface AddToCartProps {
  selectedProduct: string;
  onAddToCart: (productId: string) => void;
  products: Product[];
  setLastSelectedProduct: (productId: string) => void;
}

const AddToCart: React.FC<AddToCartProps> = ({
  selectedProduct,
  onAddToCart,
  products,
  setLastSelectedProduct,
}) => {
  const handleClick = () => {
    const product = products.find((p) => p.id === selectedProduct);

    if (!product || product.stockQuantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    setLastSelectedProduct(selectedProduct);
    onAddToCart(selectedProduct);
  };

  return (
    <button onClick={handleClick} className='bg-blue-500 text-white px-4 py-2 rounded'>
      추가
    </button>
  );
};

export default AddToCart;
