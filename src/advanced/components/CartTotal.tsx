import { DOM_IDS } from "advanced/constants";
import { useCartContext } from "advanced/contexts/CartProvider";

const CartTotal = () => {
  const { cartState } = useCartContext();

  // 총액
  let finalPrice = 0;

  cartState.items.forEach((item) => (finalPrice += item.price * item.quantity));

  // 할인율
  let discountRate = 0;

  // 포인트
  const point = Math.floor(finalPrice / 1000);

  return (
    <div id={DOM_IDS.CART_TOTAL} className="my-4 text-xl font-bold">
      총액: {Math.round(finalPrice)}원
      {discountRate > 0 && (
        <span className="ml-2 text-green-500">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span id={DOM_IDS.LOYALTY_POINTS} className="ml-2 text-blue-500">
        (포인트: {point})
      </span>
    </div>
  );
};

export default CartTotal;
