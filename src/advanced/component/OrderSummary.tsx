import { POINT_RATE } from '../constant';
import { Product } from '../type/type';

export const OrderSummary = ({ cartItems }: { cartItems: Product[] }) => {
  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      <span id='cart-total-amount'>
        총액: {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}원
      </span>
      <span id='loyalty-points' className='text-blue-500 ml-2'>
        (포인트: {cartItems.reduce((acc, item) => acc + item.price * item.quantity * POINT_RATE, 0)}
        원)
      </span>
      {/* 할인 */}
      <span id='discount-info' className='text-green-500 ml-2'>
        (0% 할인)
      </span>
    </div>
  );
};
