import CartItem from './CartItem';
import { useCartStore } from '../hooks/useCart';

export const CartList = () => {
  const { productList } = useCartStore();

  const visibleProducts = productList.filter((product) => product.quantity > 0);

  return (
    <div id="cart-items">
      {visibleProducts.map((p) => (
        <CartItem key={p.id} product={p} />
      ))}
    </div>
  );
};
