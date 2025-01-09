import React from 'react';

import type { CartItemType } from '../store/useCartStore';
import { useCartItemsStore } from '../store/useCartStore';
import { useProductsStore } from '../store/useProductsStore';

export const CartItems = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem } =
    useCartItemsStore();
  const { products, increaseStock, decreaseStock } = useProductsStore();

  const handleIncreaseClick = (cartItem: CartItemType) => () => {
    const product = products.find((product) => product.id === cartItem.id);
    if (!product) {
      alert('상품이 없습니다.');
      return;
    }

    if (cartItem.quantity + 1 <= product.stock) {
      increaseQuantity(cartItem.id);
      decreaseStock(cartItem.id);
    }

    if (cartItem.quantity + 1 > product.stock) {
      alert('재고가 부족합니다.');
    }
  };

  const handleDecreaseClick = (cartItem: CartItemType) => () => {
    if (cartItem.quantity - 1 > 0) {
      decreaseQuantity(cartItem.id);
      increaseStock(cartItem.id);
    }

    if (cartItem.quantity - 1 <= 0) {
      removeItem(cartItem.id);
      increaseStock(cartItem.id);
    }
  };

  const handleRemoveItemClick = (cartItem: CartItemType) => () => {
    removeItem(cartItem.id);
    increaseStock(cartItem.id, cartItem.quantity);
  };

  return (
    <div id='cart-items'>
      {cartItems.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          cartItem={cartItem}
          onIncreaseClick={handleIncreaseClick(cartItem)}
          onDecreaseClick={handleDecreaseClick(cartItem)}
          onRemoveItemClick={handleRemoveItemClick(cartItem)}
        />
      ))}
    </div>
  );
};

interface CartItemProps {
  cartItem: CartItemType;
  onIncreaseClick: React.MouseEventHandler<HTMLButtonElement>;
  onDecreaseClick: React.MouseEventHandler<HTMLButtonElement>;
  onRemoveItemClick: React.MouseEventHandler<HTMLButtonElement>;
}

const CartItem = ({
  cartItem,
  onIncreaseClick,
  onDecreaseClick,
  onRemoveItemClick,
}: CartItemProps) => {
  return (
    <div className='mb-2 flex items-center justify-between'>
      <span>
        {cartItem.name} - {cartItem.price}원 x {cartItem.quantity}
      </span>
      <div>
        <button
          className='mr-1 rounded bg-blue-500 px-2 py-1 text-white'
          onClick={onDecreaseClick}
        >
          -
        </button>
        <button
          className='mr-1 rounded bg-blue-500 px-2 py-1 text-white'
          onClick={onIncreaseClick}
        >
          +
        </button>
        <button
          className='rounded bg-red-500 px-2 py-1 text-white'
          onClick={onRemoveItemClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
