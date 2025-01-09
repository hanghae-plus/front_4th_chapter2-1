import { useCartItemsStore } from '../store/useCartStore';
import { calculateCartSummary } from '../utils/calculateCartSummary';

export const CartTotal = () => {
  const { cartItems } = useCartItemsStore();

  const { salePrice, discountRate } = calculateCartSummary(cartItems);
  const loyaltyPoint = salePrice > 0 ? Math.floor(salePrice / 1000) : 0;

  return (
    <div className='my-4 text-xl font-bold'>
      <span>총액: ${Math.round(salePrice)}원</span>
      {discountRate > 0 && (
        <span>(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span className='ml-2 text-blue-500'>(포인트: ${loyaltyPoint})</span>
    </div>
  );
};
