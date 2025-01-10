import CartItem from './CartItem';
import { useCartStore } from '../hooks/useCart';

export const CartList = () => {
  const { productList } = useCartStore();

  return (
    <div id="cart-items">
      {productList.map((p) => (
        <CartItem key={p.id} product={p} />
      ))}
    </div>
  );
};
