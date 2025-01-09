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
    if (!product || !selectedProduct) return;
    if (product.quantity <= 0) {
      alert('재고가 없습니다.');
      return;
    }
    if (product.quantity > 0) {
      setCartItems((prev) => {
        //장바구니에 이미 상품이 있는 경우
        const cartItem = prev.find((p) => p.id === selectedProduct.id);
        if (cartItem) {
          return prev.map((p) =>
            p.id === selectedProduct.id ? { ...p, quantity: cartItem.quantity + 1 } : p,
          );
        }
        return [...prev, { ...selectedProduct, quantity: 1 }];
      });
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
