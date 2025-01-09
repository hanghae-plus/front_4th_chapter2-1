import { useQuantityChange } from '../hooks/useQuantityChange';
import { useCart } from '../stores/CartContext';

import type { Product } from '../types/product.type';

export const CartProductList = () => {
  const { state, dispatch } = useCart();
  const { items } = state;
  const { increaseQuantity, decreaseQuantity } = useQuantityChange();

  const removeItem = (productId: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId },
    });
  };

  return (
    <div id="cart-items">
      {items.map((product) => (
        <CartProduct
          key={product.id}
          product={product}
          onIncreaseQuantity={increaseQuantity}
          onDecreaseQuantity={decreaseQuantity}
          onRemoveItem={removeItem}
        />
      ))}
    </div>
  );
};

type CartProductProps = {
  product: Product;
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
};
const CartProduct = ({
  product,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}: CartProductProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <span>{`${product.name} - ${product.originalPrice}원 x ${product.quantity}`}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="-1"
          onClick={() => onDecreaseQuantity(product.id)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={product.id}
          data-change="1"
          onClick={() => onIncreaseQuantity(product.id)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={product.id}
          onClick={() => onRemoveItem(product.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
