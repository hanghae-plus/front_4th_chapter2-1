import { useAddToCart } from './useAddToCart';
import { useCart } from '../stores/CartContext';
import { useProducts } from '../stores/ProductContext';

export const useQuantityChange = () => {
  const {
    state: { items: cartItems },
    dispatch,
  } = useCart();
  const { increaseQuantity: increaseProductQuantity } = useProducts();
  const { handleAddToCart } = useAddToCart();

  const increaseQuantity = (productId: string) => {
    if (!productId) return;
    handleAddToCart(productId);
  };

  const decreaseQuantity = (productId: string) => {
    const item = cartItems.find((item) => item.id === productId);

    if (!item) return;
    dispatch({
      type: 'DECREASE_QUANTITY',
      payload: { productId, quantity: 1 },
    });
    increaseProductQuantity(productId, 1);
  };

  return { increaseQuantity, decreaseQuantity };
};
