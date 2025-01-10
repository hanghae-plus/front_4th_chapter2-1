import React, { useEffect, useRef } from 'react';
import { discountAlertProcessor } from './service';

import { AddBtn, Cart, Select, StockInfo, Sum } from './component';
import { useGlobalContext } from './context';
import { DISC_INITIAL_BUFFERS, DISC_INTERVALS } from './const/const';

export const AppContent = () => {
  const { values, actions } = useGlobalContext();
  const { productList, cartItemList } = values;
  const { setRandomDiscRate } = actions;

  const lastSelectedId = useRef<string | null>(null);

  useEffect(() => {
    setLuckyDiscAlert();
    setAdditionalDiscAlert();
  }, []);

  const setLuckyDiscAlert = () => {
    setTimeout(() => {
      setInterval(() => {
        const luckyItem =
          productList[Math.floor(Math.random() * productList.length)];

        discountAlertProcessor(luckyItem, 'LUCKY_DISC', setRandomDiscRate);
      }, DISC_INTERVALS.LUCKY_DISC);
    }, Math.random() * DISC_INITIAL_BUFFERS.LUCKY_DISC);
  };

  const setAdditionalDiscAlert = () => {
    setTimeout(() => {
      setInterval(() => {
        if (!lastSelectedId.current) return;

        const suggestedProduct = productList.find((product) => {
          const isLastSelected = product.id === lastSelectedId.current;

          if (isLastSelected) {
            return false;
          } else {
            const cartItemQty =
              cartItemList.find((item) => item.id !== product.id)?.qty ?? 0;
            return cartItemQty < product.qty;
          }
        });

        if (!suggestedProduct) return;

        discountAlertProcessor(
          suggestedProduct,
          'ADDITIONAL_DISC',
          setRandomDiscRate,
        );
      }, DISC_INTERVALS.ADDITIONAL_DISC);
    }, Math.random() * DISC_INITIAL_BUFFERS.ADDITIONAL_DISC);
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart />
        <Sum />
        <form>
          <Select />
          <AddBtn
            setLastSelectedId={(id: string) => {
              lastSelectedId.current = id;
            }}
          />
        </form>
        <StockInfo />
      </div>
    </div>
  );
};

export default AppContent;
