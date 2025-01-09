import { useCart } from '../stores/CartContext';

import type { Product } from '../types/product.type';

export const CartProductList = () => {
  const { state } = useCart();
  const { items } = state;

  return (
    <div id="cart-items">
      {items.map((product) => (
        <CartProduct key={product.id} product={product} />
      ))}
    </div>
  );
};

const CartProduct = ({ product }: { product: Product }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>{`${product.name} - ${product.originalPrice}원 x ${product.quantity}`}</span>
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
