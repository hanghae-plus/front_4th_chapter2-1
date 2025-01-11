import React from 'react';

export const Cart = () => {
  type saleItemT = {
    id: String;
    name: String;
    price: number;
    qty: number;
    discountRate?: number;
  };
  const saleItemList: saleItemT[] = [
    { id: 'p1', name: '상품1', price: 10000, qty: 50 },
    { id: 'p2', name: '상품2', price: 20000, qty: 30 },
    { id: 'p3', name: '상품3', price: 30000, qty: 20 },
    { id: 'p4', name: '상품4', price: 15000, qty: 0 },
    { id: 'p5', name: '상품5', price: 25000, qty: 10 },
  ];
  return (
    <div>
      <div id="cart-total" className="text-xl font-bold my-4"></div>
      <div id="cart-items">{3 + 5}</div>
      <select id="product-select" className="border rounded p-2 mr-2">
        {saleItemList.map((saleItem) => {
          return (
            <option key={saleItem.id} value={saleItem.id} disabled={saleItem.qty === 0}>
              {saleItem.name} - {saleItem.price}원
            </option>
          );
        })}
      </select>
    </div>
  );
};
