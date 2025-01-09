import { useCartContext } from '../../context/CartContext';
import CartItem from './CartItem';

function CartList() {
  const { cartList } = useCartContext();

  return (
    <div id="cart-items" className="my-4">
      {cartList.map((item) => (
        <CartItem key={item.id} product={item} />
      ))}
    </div>
  );
}

export default CartList;
