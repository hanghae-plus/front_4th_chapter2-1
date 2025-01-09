import { useCart } from '../stores/CartContext';
import { useProducts } from '../stores/ProductContext';

export const useAddToCart = () => {
  const { dispatch } = useCart();
  const { getItem: getProduct, decreaseQuantity } = useProducts();

  const handleAddToCart = (productId: string) => {
    if (!productId) return;

    if (getProduct(productId)?.quantity > 0) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product: getProduct(productId), quantity: 1 },
      });
      decreaseQuantity(productId, 1);
    } else {
      alert('재고가 부족합니다');
    }
  };

  return { handleAddToCart };
};
