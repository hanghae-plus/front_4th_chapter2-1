import { useCart } from '../stores/CartContext';
import { useProducts } from '../stores/ProductContext';

type AddToCartButtonProps = {
  selectedItemId: string;
};
export const AddToCartButton = ({ selectedItemId }: AddToCartButtonProps) => {
  const { dispatch } = useCart();
  const { getItem, decreaseQuantity } = useProducts();

  const handleAddToCart = () => {
    if (!selectedItemId) return;

    if (getItem(selectedItemId)?.quantity > 0) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product: getItem(selectedItemId), quantity: 1 },
      });
      decreaseQuantity(selectedItemId, 1);
    } else {
      alert('재고가 부족합니다');
    }
  };

  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={handleAddToCart}
    >
      추가
    </button>
  );
};
