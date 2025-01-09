import React from 'react';
import { CartItems } from '../components/cart/CartItems';
import { TotalInfo } from '../components/cart/TotalInfo';
import { SelectProduct } from '../components/cart/SelectProduct';
import { StockStatus } from '../components/cart/StockStatus';

export const CartTemplate = () => {
  return (
    <div data-testid="container" className="bg-gray-100 p-8">
      <div
        data-testid="wrapper"
        className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"
      >
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItems />
        <TotalInfo />
        <SelectProduct />
        <StockStatus />
      </div>
    </div>
  );
};
