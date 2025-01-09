import { useProductListContext } from "../hooks/useProductListContext";
import { CartItem } from "./CartItem";

export function Cart() {
  const { shoppingCart, cartTotalPrice, cartCount, discountRate } = useProductListContext();
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items">
        {shoppingCart.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>
      <div id="cart-total" className="text-xl font-bold my-4">
        총액: {Math.round(cartTotalPrice)}원
        {discountRate > 0 && <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>}
        <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: {Math.floor(cartTotalPrice / 1000)})
        </span>
      </div>
    </>
  );
}
