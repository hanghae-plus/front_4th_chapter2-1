import { useCartContext } from '../hook/useCartContext';

const CartTotal = () => {
  const { cart, isDisplayBonusPoint } = useCartContext();

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      {isDisplayBonusPoint
        ? `Total: ${totalAmt}원 (Bonus: ${cart.bonusPoints} Points)`
        : `총액: {Math.round(cart.totalAmt)}원`}
      {cart.bonusPoints > 0 && (
        <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: {cart.bonusPoints})
        </span>
      )}
    </div>
  );
};

export default CartTotal;
