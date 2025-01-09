import React from 'react';

export const OrderSummary = () => {
  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      <span id="cart-total-amount">총액: 0원</span>
      <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: 0)
        </span>
        {/* 할인 */}
        <span id="discount-info" className="text-green-500 ml-2"></span>
      </div>
    );
  };
