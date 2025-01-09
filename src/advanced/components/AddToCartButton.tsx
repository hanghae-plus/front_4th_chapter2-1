import { useAddToCart } from '../hooks/useAddToCart';

type AddToCartButtonProps = {
  selectedItemId: string;
};
export const AddToCartButton = ({ selectedItemId }: AddToCartButtonProps) => {
  const { handleAddToCart } = useAddToCart(selectedItemId);

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
