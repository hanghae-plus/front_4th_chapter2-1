import React from 'react';
import { UI_CLASSES } from '../constants';

interface CartSummaryProps {
  totalAmount: number;
  discount?: number;
  points: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ totalAmount, discount, points }) => {
  return (
    <div className={UI_CLASSES.TOTAL}>
      <span>총액: {Math.round(totalAmount)}원</span>
      {discount && discount > 0 && (
        <span className={UI_CLASSES.DISCOUNT_TEXT}>({(discount * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span className={UI_CLASSES.POINTS_TEXT}>(포인트: {points})</span>
    </div>
  );
};
