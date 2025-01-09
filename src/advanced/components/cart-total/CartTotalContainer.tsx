import { DISCOUNT_RATES, LOYALTY_POINTS_RATE, THRESHOLD } from '../../constants';
import { useProduct } from '../../context/ProductContext';
import { ProductListType } from '../../types/ProductType';
import { calculateOverallDiscount } from '../../utils/calculateOverallDiscount';
import { helper } from '../../utils/helper';
import CartTotal from './CartTotal';

export const calculateCart = (cartList: ProductListType) => {
  let totalAmount = 0;
  let itemCount = 0;
  let preDiscountTotal = 0;

  cartList.forEach((cart) => {
    const quantity = cart.quantity;
    itemCount += quantity;

    const currentItemAmount = cart.price * quantity;
    preDiscountTotal += currentItemAmount;

    // 할인 조건 확인 및 할인율 계산
    const discountCondition = quantity >= THRESHOLD.QUANTITY;
    const discountRate = discountCondition
      ? (DISCOUNT_RATES['PRODUCT'][cart.id as keyof (typeof DISCOUNT_RATES)['PRODUCT']] ?? 0)
      : 0;
    totalAmount += currentItemAmount * (1 - discountRate);
  });

  return {
    totalAmount,
    itemCount,
    preDiscountTotal,
  };
};

export default function CartTotalContainer() {
  const { cartList } = useProduct();
  const { itemCount, preDiscountTotal, totalAmount } = calculateCart(cartList);
  const { overallDiscountRate, discountedTotalAmount } = calculateOverallDiscount(
    totalAmount,
    preDiscountTotal,
    itemCount,
  );
  const discountedAmount = Math.round(discountedTotalAmount);
  const discountedRate = (overallDiscountRate * 100).toFixed(1);

  const bonusPoint = Math.floor(totalAmount / LOYALTY_POINTS_RATE);

  return (
    <CartTotal amount={discountedAmount} point={bonusPoint}>
      {overallDiscountRate ? (
        <span className='ml-2 text-green-500'>
          {helper.getDiscountedAmountMessage(discountedRate)}
        </span>
      ) : null}
    </CartTotal>
  );
}
