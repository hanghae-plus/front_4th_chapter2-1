import React from 'react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
  onQuantityChange: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => (
  <div className='flex justify-between items-center mb-2'>
    <span>
      {item.name} - {item.price}원 x {item.quantity}
    </span>
    <div>
      <button
        className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
        onClick={() => onQuantityChange(item.id, -1)}
      >
        -
      </button>
      <button
        className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
        onClick={() => onQuantityChange(item.id, 1)}
      >
        +
      </button>
      <button
        className='remove-item bg-red-500 text-white px-2 py-1 rounded'
        onClick={() => onRemove(item.id)}
      >
        삭제
      </button>
    </div>
  </div>
);

export default CartItem;
