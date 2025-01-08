import React from 'react';
import { CartItem, Product } from '../type';
import { CURRENCY, ID_BY_COMPONENT } from '../const';

interface CartProps {
  productList: Product[];
  cartItemList: CartItem[];
}

const Cart: React.FC<CartProps> = ({ productList, cartItemList }) => {
  return (
    <div id={ID_BY_COMPONENT.CART_ID}>
      {cartItemList.map((item) => {
        const product = productList.find(({ id }) => id === item.id);

        return (
          product && (
            <div
              id={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {product.name} - {product.val}
                {CURRENCY} x {item.qty}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={item.id}
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
          )
        );
      })}
    </div>
  );
};

export default React.memo(Cart);
