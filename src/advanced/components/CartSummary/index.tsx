import React from "react";
import { CartTotals } from "../../types";

interface CartSummaryProps {
  totals: CartTotals;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totals }) => {
  const points = Math.floor(totals.subTotal / 100);

  return (
    <div className="mt-4 space-y-2">
      <div className="text-lg">
        총액: {Math.round(totals.totalAmount)}원
        {totals.discount > 0 &&
          ` (${(totals.discount * 100).toFixed(1)}% 할인 적용)`}
      </div>
      <div className="text-sm text-gray-600">(포인트: {points})</div>
    </div>
  );
};

export default CartSummary;
