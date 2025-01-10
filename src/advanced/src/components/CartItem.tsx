import { useCartActionsContext } from '../contexts/CartProvider';
import type { CartItem } from '../contexts/CartProvider.types';
import { useProductsActionsContext } from '../contexts/ProductsProvider';
import { usePreservedCallback } from '../hooks/usePreservedCallback';

interface Props {
  id: string;
  quantity: CartItem['quantity'];
}

const CartItem = ({ id, quantity }: Props) => {
  const { getProduct } = useProductsActionsContext('CartItem');
  const product = getProduct(id);

  const { addItem, subtractItem, deleteItem } = useCartActionsContext('CartItem');

  const handleIncreaseButtonClick = usePreservedCallback(() => {
    addItem(id);
  });

  const handleDecreaseButtonClick = usePreservedCallback(() => {
    subtractItem(id);
  });

  const handleDeleteButtonClick = usePreservedCallback(() => {
    deleteItem(id);
  });

  if (!product) return null;

  return (
    <div className="mb-2 flex items-center justify-between">
      <span>
        {product.name} - {product.price}원 x {quantity}
      </span>
      <div>
        <button
          className="mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          onClick={handleDecreaseButtonClick}
        >
          -
        </button>
        <button
          className="mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          onClick={handleIncreaseButtonClick}
        >
          +
        </button>
        <button
          className="rounded bg-red-500 px-2 py-1 text-white"
          onClick={handleDeleteButtonClick}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
