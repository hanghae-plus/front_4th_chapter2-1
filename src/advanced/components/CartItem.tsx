import type { Cart } from '../types/cart.type';

interface CartItemProps {
  cart: Cart;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem = ({ cart, onIncrease, onDecrease, onRemove }: CartItemProps) => {
  return (
    <div id={cart.id} className="flex justify-between items-center mb-2">
      <span>
        {cart.name} - {cart.price}원 x {cart.quantity}
      </span>
      <div>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={onDecrease}>
          -
        </button>

        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={onIncrease}>
          +
        </button>

        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" onClick={onRemove}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
