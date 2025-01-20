import React from 'react';
import { CartItem as CartItemType } from '../types';
import { UI_CLASSES, UI_TEXT } from '../constants';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, change: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className={UI_CLASSES.CART_ITEM}>
      <span>
        {item.name} - {item.price}원 x {item.quantity}
      </span>
      <div>
        <button
          className={UI_CLASSES.QUANTITY_BUTTON}
          onClick={() => onQuantityChange(item.id, -1)}
        >
          -
        </button>
        <button className={UI_CLASSES.QUANTITY_BUTTON} onClick={() => onQuantityChange(item.id, 1)}>
          +
        </button>
        <button className={UI_CLASSES.REMOVE_BUTTON} onClick={() => onRemove(item.id)}>
          {UI_TEXT.REMOVE_BUTTON}
        </button>
      </div>
    </div>
  );
};
