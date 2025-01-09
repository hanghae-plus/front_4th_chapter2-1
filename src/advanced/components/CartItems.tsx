import React from 'react';

import type { CartItemType, ProductType } from '../pages/CartPage';

interface CartItemsProps {
  cartItems: CartItemType[];
  productList: ProductType[];
}

export const CartItems = ({ cartItems, productList }: CartItemsProps) => {
  return <div id='cart-items'>CartItems</div>;
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
    <div  className='mb-2 flex items-center justify-between'>
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
