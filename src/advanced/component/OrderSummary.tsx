import { BULK_DISCOUNT_THRESHOLD, DISCOUNT_RATES, POINT_RATE } from '../constant';
import { Product } from '../type/type';

export const OrderSummary = ({ cartItems }: { cartItems: Product[] }) => {
  const calculateTotalWithDiscount = (cartItems: Product[]) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // 개별 상품 할인 계산
    let finalTotal = cartItems.reduce((acc, item) => {
      if (item.quantity >= 10) {
        const discountRate = DISCOUNT_RATES[item.id as keyof typeof DISCOUNT_RATES] || 0;
        return acc + item.price * item.quantity * (1 - discountRate);
      }
      return acc + item.price * item.quantity;
    }, 0);

    // 대량 구매 할인 체크 (30개 이상)
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscountTotal = subtotal * (1 - 0.25);
      finalTotal = Math.min(finalTotal, bulkDiscountTotal);
    }

    let discountRate = (subtotal - finalTotal) / subtotal;

    // 화요일 할인 추가 적용 (10%)
    const isTuesday = new Date().getDay() === 2;
    if (isTuesday) {
      finalTotal *= 1 - 0.1;
      // 표시될 할인율은 기존 할인율과 10% 중 큰 것을 선택
      discountRate = Math.max(discountRate, 0.1);
    }

    return {
      total: finalTotal,
      discountInfo:
        discountRate > 0 &&
        `${(discountRate * 100).toFixed(1)}% 할인${isTuesday ? ' (화요일 할인 포함)' : ''}`,
    };
  };

  const { total, discountInfo } = calculateTotalWithDiscount(cartItems);

  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      <span id='cart-total-amount'>총액: {total}원</span>
      <span id='loyalty-points' className='text-blue-500 ml-2'>
        (포인트: {Math.floor(total * POINT_RATE)}원)
      </span>
      <span id='discount-info' className='text-green-500 ml-2'>
        {discountInfo}
      </span>
    </div>
  );
};
