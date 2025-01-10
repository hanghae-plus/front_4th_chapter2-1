import { useCartStore } from '../hooks/useCart';
import { Product } from '../types/types';

interface CartItemProps {
  product: Product;
}
const CartItem = ({ product }: CartItemProps) => {
  const { changeToCart, removeToCart } = useCartStore();

  const handleUpdateCartClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    const productId = target.getAttribute('data-product-id');

    if (!productId) return;

    if (target.id === 'data-add' || target.id === 'data-sub') {
      const change = target.id === 'data-add' ? 1 : -1;

      changeToCart(productId, change);
    } else if (target.id === 'data-remove') {
      removeToCart(productId);
    }
  };

  return (
    <div id={product.id} className="flex justify-between items-center mb-2">
      <span>
        {product.name} - {product.price}원 x {product.quantity}
      </span>
      <div>
        <button
          id="data-sub"
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="-1"
          onClick={handleUpdateCartClick}
        >
          -
        </button>
        <button
          id="data-add"
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="1"
          onClick={handleUpdateCartClick}
        >
          +
        </button>
        <button
          id="data-remove"
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={product.id}
          onClick={handleUpdateCartClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
