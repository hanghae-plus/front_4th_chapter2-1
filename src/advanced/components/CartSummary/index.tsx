import React from "react";
import { CartTotalList } from "../../types";

interface CartSummaryProps {
  totalList: CartTotalList;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalList }) => {
  const pointList = Math.floor(totalList.subTotal / 100);

  return (
    <div className="mt-4 space-y-2">
      <div className="text-lg">
        총액: {Math.round(totalList.totalAmount)}원
        {totalList.discount > 0 &&
          ` (${(totalList.discount * 100).toFixed(1)}% 할인 적용)`}
      </div>
      <div className="text-sm text-gray-600">(포인트: {pointList})</div>
    </div>
  );
};

export default CartSummary;
