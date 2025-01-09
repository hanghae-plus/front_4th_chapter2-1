import React from 'react';
import { CURRENCY, ID_BY_COMPONENT } from '../const';
import { useGlobalContext } from '../context';

const Cart: React.FC = () => {
  const { values, actions } = useGlobalContext();
  const { productList, cartItemList, randomDiscRateByProduct } = values;
  const { removeCartItem, editCartItem } = actions;

  const handleClickQtyChangeBtn = (id: string, qtyChange: number) => {
    const cartItem = cartItemList.find((item) => item.id === id);

    if (!cartItem) {
      throw Error('Selected cart item is not valid.');
    }

    const curQty = cartItem.qty;
    const newQty = curQty + qtyChange;

    if (newQty > 0) {
      editCartItem(id, newQty);
    } else {
      removeCartItem(id);
    }
  };

  const handleClickRemoveItemBtn = (id: string) => removeCartItem(id);

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
                {product.name} -&nbsp;
                {product.val * (1 - randomDiscRateByProduct[item.id])}
                {CURRENCY} x {item.qty}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleClickQtyChangeBtn(item.id, -1)}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleClickQtyChangeBtn(item.id, 1)}
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleClickRemoveItemBtn(item.id)}
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
