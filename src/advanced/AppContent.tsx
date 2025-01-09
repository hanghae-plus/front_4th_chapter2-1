import React, { useEffect, useRef } from 'react';
import { setAdditionalDiscAlert, setLuckyDiscAlert } from './discountService';

import { AddBtn, Cart, Select, StockInfo, Sum } from './component';
import { useGlobalContext } from './context';

export const AppContent = () => {
  const { values, actions } = useGlobalContext();
  const { productList, lastSelectedId } = values;
  const { setRandomDiscRate } = actions;

  useEffect(() => {
    setLuckyDiscAlert(productList, setRandomDiscRate);
    setAdditionalDiscAlert(productList, lastSelectedId, setRandomDiscRate);
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart />
        <Sum />
        <form>
          <Select />
          <AddBtn />
        </form>
        <StockInfo />
      </div>
    </div>
  );
};

export default AppContent;
