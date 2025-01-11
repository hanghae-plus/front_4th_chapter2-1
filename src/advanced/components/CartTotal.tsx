import { useCartStore } from '../hooks/useCart';
import { DISCOUNT_RATES, SALE_DAY } from '../types/constant';
import { Product } from '../types/types';

const calcCart = (products: Product[]): { totalAmount: number; discountRate: number } => {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  products.forEach((product) => {
    if (product.quantity > 0) {
      let discount = 0;
      const itemTotal = product.price * product.quantity;

      // 수량 10개 이상시 개별 할인
      if (product.quantity >= 10) {
        discount = DISCOUNT_RATES[product.id] || 0;
      }

      itemCount += product.quantity;
      subTotal += itemTotal;
      totalAmount += itemTotal * (1 - discount);
    }
  });

  // 대량 구매 할인 계산
  const bulkDiscountResult = calculateDiscount(totalAmount, itemCount, subTotal);

  // 특별 할인 계산
  const specialDiscountResult = calculateSpecialDiscount(
    bulkDiscountResult.totalAmount,
    bulkDiscountResult.discountRate
  );

  return {
    totalAmount: specialDiscountResult.totalAmount,
    discountRate: specialDiscountResult.discountRate,
  };
};

const calculateDiscount = (totalAmount: number, itemCount: number, subTotal: number) => {
  let discountRate = 0;

  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  return { totalAmount, discountRate };
};

const calculateSpecialDiscount = (totalAmount: number, discountRate: number) => {
  if (new Date().getDay() === SALE_DAY) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  return { totalAmount, discountRate };
};

const CartTotal = () => {
  const { productList } = useCartStore();
  const { totalAmount, discountRate } = calcCart(productList);
  const totalPoint = Math.floor(totalAmount / 1000);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {Math.round(totalAmount)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {totalPoint})
      </span>
    </div>
  );
};

export default CartTotal;
