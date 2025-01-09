import { calculateFinalAmount } from '../services/calcProductDiscount';
import { useCart } from '../stores/CartContext';

export const TotalPrice = () => {
  const {
    state: { items },
  } = useCart();
  const { amount, discountRate } = calculateFinalAmount(items);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {amount}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};
