import {
  calculateDiscountedCost,
  calculateDiscountRate,
  calculateTotalPoint
} from "../lib";
import { Cart } from "../model";

interface CartTotalProps {
  cart: Cart;
}

export function CartTotal({ cart }: CartTotalProps) {
  const discountedCost = calculateDiscountedCost(cart);
  const discountRate = calculateDiscountRate(cart);
  const point = calculateTotalPoint(cart);

  return (
    <div className="text-xl font-bold my-4">
      <span>총액: {discountedCost}원</span>
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span className="text-blue-500 ml-2">(포인트: {point})</span>
    </div>
  );
}
