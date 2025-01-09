import { ELEMENT_IDS } from "@/constants/element-id";

const CartTotal = ({ amount, discountRate, point }) => {
  return (
    <div className="text-xl font-bold my-4">
      총액: ${Math.round(amount)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span id={ELEMENT_IDS.POINT}>(포인트: {point})</span>
    </div>
  );
};

export default CartTotal;