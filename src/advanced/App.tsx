import React, { useEffect, useRef, useState } from 'react';
import { ID_BY_COMPONENT } from './const';

import { setAdditionalDiscAlert, setLuckyDiscAlert } from './discountService';

import { handleClickAddBtn, handleClickCart } from './eventHandlers';

import { updateBonusPts, updateDiscInfo, updateStockInfo } from './updaters';
import { Product } from './type';
import { Cart, Select, StockInfo, Sum } from './component';

export const App = () => {
  const productList: Product[] = [
    { id: 'p1', name: '상품1', val: 10000, qty: 50 },
    { id: 'p2', name: '상품2', val: 20000, qty: 30 },
    { id: 'p3', name: '상품3', val: 30000, qty: 20 },
    { id: 'p4', name: '상품4', val: 15000, qty: 0 },
    { id: 'p5', name: '상품5', val: 25000, qty: 10 },
  ];

  const [cartItemList, setCartItemList] = useState<Product[]>([]);

  const lastSel = useRef<Product | null>(null);

  useEffect(() => {
    setLuckyDiscAlert(productList);
    setAdditionalDiscAlert(productList, lastSel.current);

    const addBtn = document.querySelector(`#${ID_BY_COMPONENT.ADD_BTN_ID}`);
    addBtn?.addEventListener('click', () =>
      handleClickAddBtn(productList, (selItem) => {
        lastSel.current = selItem;
      }),
    );

    const cart = document.querySelector(`#${ID_BY_COMPONENT.CART_ID}`);
    cart?.addEventListener('click', (e) => handleClickCart(e, productList));
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart cartItemList={cartItemList} />
        <Sum productList={productList} cartItemList={cartItemList} />
        <Select productList={productList} />
        <button
          id={ID_BY_COMPONENT.ADD_BTN_ID}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          추가
        </button>
        <StockInfo productList={productList} />
      </div>
    </div>
  );
};
