import { Product } from '../types/types';

interface CartItemProps {
  product: Product;
}
const CartItem = ({ product }: CartItemProps) => {
  return (
    <div id={product.id} className="flex justify-between items-center mb-2">
      <span>
        {product.name} - {product.price}원 x {product.quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="-1"
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="1"
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={product.id}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
