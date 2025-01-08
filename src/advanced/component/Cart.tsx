import React, { useCallback } from 'react';
import { CartItem, Product } from '../type';
import { CURRENCY, ID_BY_COMPONENT } from '../const';

interface CartProps {
  productList: Product[];
  cartItemList: CartItem[];
  setCartItemList: (prev: CartItem[]) => void;
}

const Cart: React.FC<CartProps> = ({
  productList,
  cartItemList,
  setCartItemList,
}) => {
  const handleClickQtyChangeBtn = useCallback(
    (id: string, qtyChange: number) => {
      const cartItem = cartItemList.find((item) => item.id === id);
      const product = productList.find((product) => product.id === id);

      if (!cartItem) {
        throw Error('Selected cart item is not valid.');
      }
      if (!product) {
        throw Error('Selected cart item is not in the product list.');
      }

      const curQty = cartItem.qty;
      const newQty = curQty + qtyChange;

      // 변경될 수량이 0보다 큰 경우
      if (newQty > 0 && newQty <= product.qty + curQty) {
        const newCartItemList = cartItemList.map((item) =>
          item.id === id ? { id: id, qty: newQty } : item,
        );
        setCartItemList(newCartItemList);
        return;
      }

      // 변경될 수량이 0인 경우
      if (newQty <= 0) {
        const newCartItemList = cartItemList.filter((item) => item.id !== id);
        setCartItemList(newCartItemList);
        return;
      }

      // 변경될 수량이 0보다 작은 경우
      alert('재고가 부족합니다.');
    },
    [cartItemList],
  );

  const handleClickRemoveItemBtn = useCallback(
    (id: string) => {
      const cartItem = cartItemList.find((item) => item.id === id);

      if (!cartItem) {
        throw Error('Selected cart item is not valid.');
      }

      const newCartItemList = cartItemList.filter((item) => item.id !== id);
      setCartItemList(newCartItemList);
    },
    [cartItemList],
  );

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
