import { useClearCartItem } from '../../../contexts/cart-context/CartProvider';

import type { Product } from '../../../types/product';

interface CartItemProps {
  item: Product;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { name, id, amount, quantity } = item;

  const clearCartItem = useClearCartItem();

  const handleClearButtonClick = () => {
    clearCartItem(id);
  };

  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span>
        {name} - {amount}원 x {quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="${id}"
          data-change="-1"
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id="${id}"
          data-change="1"
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={id}
          onClick={handleClearButtonClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
