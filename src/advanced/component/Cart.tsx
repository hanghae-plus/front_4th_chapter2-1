import React from 'react';
import { Product } from '../type';
import { CURRENCY, ID_BY_COMPONENT } from '../const';

interface CartProps {
  cartItemList: Product[];
}
const Cart: React.FC<CartProps> = ({ cartItemList }) => {
  return (
    <div id={ID_BY_COMPONENT.CART_ID}>
      {cartItemList.map((item) => (
        <div id={item.id} className="flex justify-between items-center mb-2">
          <span>
            ${item.name} - ${item.val}${CURRENCY} x 1
          </span>
          <div>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id="${itemToAdd.id}"
              data-change="-1"
            >
              -
            </button>
            <button
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={item.id}
              data-change="1"
            >
              +
            </button>
            <button
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              data-product-id={item.id}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
