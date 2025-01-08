import React, { useEffect, useRef, useState } from 'react';
import { ID_BY_COMPONENT } from './const';

import { setAdditionalDiscAlert, setLuckyDiscAlert } from './discountService';

import { handleClickCart } from './eventHandlers';

import { CartItem, Product } from './type';
import { AddBtn, Cart, Select, StockInfo, Sum } from './component';

export const App = () => {
  const productList: Product[] = [
    { id: 'p1', name: '상품1', val: 10000, qty: 50 },
    { id: 'p2', name: '상품2', val: 20000, qty: 30 },
    { id: 'p3', name: '상품3', val: 30000, qty: 20 },
    { id: 'p4', name: '상품4', val: 15000, qty: 0 },
    { id: 'p5', name: '상품5', val: 25000, qty: 10 },
  ];

  const [randomDiscRateByProduct, setRandomDiscRateByProduct] = useState<
    Record<string, number>
  >({
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    p5: 0,
  });

  const [cartItemList, setCartItemList] = useState<CartItem[]>([]);

  const lastSelId = useRef<string | null>(null);

  useEffect(() => {
    setLuckyDiscAlert(productList);
    setAdditionalDiscAlert(productList, lastSelId.current);

    const cart = document.querySelector(`#${ID_BY_COMPONENT.CART_ID}`);
    cart?.addEventListener('click', (e) => handleClickCart(e, productList));
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart productList={productList} cartItemList={cartItemList} />
        <Sum
          productList={productList}
          cartItemList={cartItemList}
          randomDiscRateByProduct={randomDiscRateByProduct}
        />
        <form>
          <Select
            productList={productList}
            randomDiscRateByProduct={randomDiscRateByProduct}
          />
          <AddBtn
            productList={productList}
            cartItemList={cartItemList}
            setCartItemList={setCartItemList}
            lastSelId={lastSelId}
          />
        </form>
        <StockInfo productList={productList} cartItemList={cartItemList} />
      </div>
    </div>
  );
};
