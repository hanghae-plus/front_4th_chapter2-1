import { PRODUCT_DISCOUNT, ProductId } from '../../constants/discount';
import { CartItem } from '../../types/cart';
import { Product } from '../../types/product';

interface CartTotalProps {
  cartItems: CartItem[];
  products: Product[];
}

const CartTotal: React.FC<CartTotalProps> = ({ cartItems, products }) => {
  const calculateSubTotal = () =>
    cartItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);

  const calculateWeekDiscount = () => {
    if (cartItems.length === 0) return 0;

    const today = new Date();
    const day = today.getDay();

    // 화요일(2)에 10% 할인
    return day === 2 ? 0.1 : 0;
  };

  const calculateBulkDiscount = () => {
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    return totalQuantity >= 30 ? 0.25 : 0; // 30개 이상 구매 시 25% 할인
  };

  // 최종 금액 계산
  const calculateFinalAmount = () => {
    const subTotal = calculateSubTotal();
    let totalAmount = 0;

    // 각 상품별 할인 계산
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return;

      const itemTotal = product.price * item.quantity;

      // 개별 상품 할인 적용
      totalAmount +=
        item.quantity >= PRODUCT_DISCOUNT[item.productId as ProductId]?.minQuantity
          ? itemTotal * (1 - PRODUCT_DISCOUNT[item.productId as ProductId].rate)
          : itemTotal;
    });

    const weekDiscount = calculateWeekDiscount();
    const bulkDiscount = calculateBulkDiscount();
    const individualDiscount = (subTotal - totalAmount) / subTotal || 0;

    // 최대 할인율 적용
    const finalDiscountRate = Math.max(weekDiscount, bulkDiscount, individualDiscount);

    return {
      amount: Math.round(totalAmount),
      discountRate: finalDiscountRate * 100,
      bonusPoints: Math.floor(totalAmount / 1000),
    };
  };

  const { amount, discountRate, bonusPoints } = calculateFinalAmount();

  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      <span>총액: {amount}원</span>
      {discountRate > 0 && (
        <span className='text-blue-500 ml-2'>({discountRate.toFixed(1)}% 할인 적용)</span>
      )}
      <span id='loyalty-points' className='text-blue-500 ml-2'>
        (포인트: {bonusPoints})
      </span>
    </div>
  );
};

export default CartTotal;
