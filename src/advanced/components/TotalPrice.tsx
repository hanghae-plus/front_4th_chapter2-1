import { calculateFinalAmount } from '../services/calcProductDiscount';
import { useCart } from '../stores/CartContext';
import { calcBonusPoint } from '../utils/calcBonusPoint.utils';

export const TotalPrice = () => {
  const {
    state: { items },
  } = useCart();
  const { amount, discountRate } = calculateFinalAmount(items);
  const bonusPoint = calcBonusPoint(amount);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {amount}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <Point point={bonusPoint} />
    </div>
  );
};

type PointProps = {
  point: number;
};
const Point = ({ point }: PointProps) => {
  return (
    <span id="loyalty-points" className="text-blue-500 ml-2">
      (포인트: {point})
    </span>
  );
};
