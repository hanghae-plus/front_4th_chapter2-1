import React from 'react';

import { BONUS_POINT_DIVISOR } from '../../constants/discount.js';
import { useCartStore } from '../../stores/cartStore';

export const TotalInfo = () => {
  const { totalPrice, discountRate } = useCartStore((state) => state);

  const bonusPoints = totalPrice / BONUS_POINT_DIVISOR;

  return (
    <div data-testid="cart-total" className="text-xl font-bold my-4">
      총액: {totalPrice}원
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoints})
      </span>
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({discountRate.toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};
