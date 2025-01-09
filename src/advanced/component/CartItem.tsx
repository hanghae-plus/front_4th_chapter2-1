import React from 'react';

export const CartItem = ({ addedItem }) => {
  return (
    <div id="cart-item" className="flex justify-between items-center mb-2">
      <span>
        {addedItem.name} - {addedItem.price}원 x 1
      </span>

      <div className="flex items-center">
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
          -
        </button>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1">
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded">
          삭제
        </button>
      </div>
    </div>
  );
};
