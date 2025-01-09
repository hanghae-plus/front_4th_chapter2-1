import React, { useEffect } from "react";
import { useCart } from "../../../../../contexts/CartContext";
import { useProduct } from "../../../../../contexts/ProductContext";
import { combineStyles } from "../../../../../utils";
import {
  QUANTITY_DISCOUNT_RATES,
  SPECIAL_DISCOUNT_DAY,
} from "../../../../../constants";

const CartSummary = () => {
  const { cartState, setCartState } = useCart();
  const { productState } = useProduct();

  const cartSummaryStyles = combineStyles("text-xl", "font-bold", "my-4");
  const pointsStyles = combineStyles("text-blue-500", "ml-2");
  const discountStyles = combineStyles("text-green-500", "ml-2");

  const calculateCart = () => {
    const calculation = {
      totalAmount: 0,
      itemCount: 0,
      subtotal: 0,
      discountRate: 0,
    };

    // 각 아이템 계산
    cartState.items.forEach((cartItem) => {
      const product = productState.products.find(
        (product) => product.id === cartItem.id
      );
      if (!product) return;

      const productTotalPrice = product.price * cartItem.quantity;
      const quantityDiscountRate =
        cartItem.quantity >= 10 ? QUANTITY_DISCOUNT_RATES[cartItem.id] || 0 : 0;

      calculation.itemCount += cartItem.quantity;
      calculation.subtotal += productTotalPrice;
      calculation.totalAmount += productTotalPrice * (1 - quantityDiscountRate);
      calculation.discountRate = Math.max(
        calculation.discountRate,
        quantityDiscountRate
      );
    });

    // 대량 구매 할인 적용 (30개 이상 구매 시 25% 할인)
    if (calculation.itemCount >= 30) {
      const bulkDiscountAmount = calculation.totalAmount * 0.25;
      const itemDiscountAmount = calculation.subtotal - calculation.totalAmount;

      if (bulkDiscountAmount > itemDiscountAmount) {
        calculation.totalAmount = calculation.subtotal * 0.75;
        calculation.discountRate = 0.25;
      }
    }

    // 화요일 할인 적용 (10% 할인)
    if (new Date().getDay() === SPECIAL_DISCOUNT_DAY) {
      calculation.totalAmount *= 0.9;
      calculation.discountRate = Math.max(calculation.discountRate, 0.1);
    }

    const bonusPoints = Math.floor(calculation.totalAmount / 1000);

    // 상태 업데이트
    setCartState((prevState) => ({
      ...prevState,
      totalAmount: Math.round(calculation.totalAmount),
      itemCount: calculation.itemCount,
      discountRate: calculation.discountRate,
      bonusPoints: bonusPoints,
      subtotal: calculation.subtotal,
    }));
  };

  // 장바구니 아이템이 변경될 때마다 계산
  useEffect(() => {
    calculateCart();
  }, [cartState.items]);

  return (
    <div id="cart-total" className={cartSummaryStyles}>
      <span>{`총액: ${cartState.totalAmount}원`}</span>
      {cartState.discountRate > 0 && (
        <span className={discountStyles}>
          {`(${(cartState.discountRate * 100).toFixed(1)}% 할인 적용)`}
        </span>
      )}
      <span id="loyalty-points" className={pointsStyles}>
        {`(포인트: ${cartState.bonusPoints})`}
      </span>
    </div>
  );
};

export default CartSummary;
