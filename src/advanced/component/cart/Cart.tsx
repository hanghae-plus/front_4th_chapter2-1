import { CartItem } from './_components/CartItem';
import { useGetCartList } from '../../contexts/cart-context/CartProvider';

export const Cart = () => {
  const cartList = useGetCartList();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <div id="cart-items">
        {cartList.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
