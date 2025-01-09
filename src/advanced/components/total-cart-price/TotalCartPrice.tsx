import { useGetPoint, useGetTotalPrice, useGetTotalDiscountRate } from '../../contexts/cart-context/CartContext';

export const TotalCartPrice = () => {
  const totalPrice = useGetTotalPrice();
  const totalDiscountRate = useGetTotalDiscountRate();
  const point = useGetPoint();

  const isShowDiscount = totalDiscountRate > 0;

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: ${Math.round(totalPrice)}원
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {point})
      </span>
      {isShowDiscount && (
        <span className="text-green-500 ml-2">(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
    </div>
  );
};
