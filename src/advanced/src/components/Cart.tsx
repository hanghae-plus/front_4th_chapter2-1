import { useEffect, useState } from 'react';
import { BULK_DISCOUNT_RATIO, PRODUCT_DISCOUNT_RATIO, TUESDAY_DISCOUNT_RATIO } from '../constants';
import { useCartStateContext } from '../contexts/CartProvider';
import { useProductsActionsContext } from '../contexts/ProductsProvider';
import { usePreservedCallback } from '../hooks/usePreservedCallback';
import CartItem from './CartItem';

const Cart = () => {
  const { items } = useCartStateContext('Cart');
  const { discountedPrice, discountRatio } = useCalculateCart();

  return (
    <div>
      <div>
        {[...items.entries()].map(([id, { quantity }], i) => (
          <CartItem key={i} id={id} quantity={quantity} />
        ))}
      </div>
      <div className="my-4 text-xl font-bold">
        총액: {Math.round(discountedPrice)}원
        {discountRatio > 0 && (
          <span className="ml-2 text-green-500">
            ({(discountRatio * 100).toFixed(1)}% 할인 적용)
          </span>
        )}
        <span className="ml-2 text-blue-500"> (포인트: {Math.floor(discountedPrice / 1000)})</span>
      </div>
    </div>
  );
};

// Hooks
function useCalculateCart() {
  const { getProduct } = useProductsActionsContext('useCalculateCart');
  const { items } = useCartStateContext('useCalculateCart');

  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountRatio, setDiscountRatio] = useState(0);

  useEffect(() => {
    [...items.entries()].forEach(([id, { quantity }]) => {
      const product = getProduct(id);

      if (!product) return;

      let discountRatio = 0;

      if (quantity >= 10) {
        discountRatio = PRODUCT_DISCOUNT_RATIO[id] || 0;
      }

      const itemPrice = product.price * quantity;
      const discountedPrice = itemPrice * (1 - discountRatio);

      setItemCount(quantity);
      setTotalPrice((prev) => prev + itemPrice);
      setDiscountedPrice((prev) => prev + discountedPrice);
    });

    return () => {
      setItemCount(0);
      setTotalPrice(0);
      setDiscountedPrice(0);
    };
  }, [items, getProduct]);

  const discountRegular = usePreservedCallback(() => {
    setDiscountRatio((totalPrice - discountedPrice) / totalPrice);
  });

  const discountBulk = usePreservedCallback(() => {
    const bulkDiscount = discountedPrice * BULK_DISCOUNT_RATIO;
    const regularDiscount = totalPrice - discountedPrice;

    if (bulkDiscount > regularDiscount) {
      setDiscountedPrice(totalPrice * (1 - BULK_DISCOUNT_RATIO));
      setDiscountRatio(BULK_DISCOUNT_RATIO);

      return;
    }

    discountRegular();
  });

  const discountTuesday = usePreservedCallback(() => {
    setDiscountedPrice((prev) => prev * (1 - TUESDAY_DISCOUNT_RATIO));
    setDiscountRatio((prev) => Math.max(prev, TUESDAY_DISCOUNT_RATIO));
  });

  useEffect(() => {
    // 일반 할인
    discountRegular();

    // 대량 구매 할인
    if (itemCount >= 30) {
      discountBulk();
    }

    // 화요일 할인
    if (isTuesday(new Date())) {
      discountTuesday();
    }
  }, [itemCount, discountRegular, discountBulk, discountTuesday]);

  return { discountedPrice, discountRatio };
}

// Utils
const isTuesday = (date: Date) => {
  return date.getDay() === 2;
};

export default Cart;
