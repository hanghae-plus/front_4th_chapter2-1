import React from 'react';
import CartItem from './CartItem';

interface CartProps {
  items: any[];
  totalAmount: number;
  onQuantityChange: (itemId: string, change: number) => void;
  onRemove: (itemId: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, totalAmount, onQuantityChange, onRemove }) => (
  <div>
    <div id='cart-items'>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
        />
      ))}
    </div>
    <div id='cart-total' className='text-xl font-bold my-4'>
      총액: {Math.round(totalAmount)}원
    </div>
  </div>
);

export default Cart;
