import { useGetTotalAmount } from '../../contexts/cart-context/CartProvider';

// dummy
const point = 0;
const totalDiscountRate = 0.1;

export const TotalPrice = () => {
  const totalAmount = useGetTotalAmount();

  const isShowDiscount = totalDiscountRate > 0;

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: ${Math.round(totalAmount)}원
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {point})
      </span>
      {isShowDiscount && (
        <span className="text-green-500 ml-2">(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};
