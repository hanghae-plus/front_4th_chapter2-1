import type { Cart } from '../types/cart.type';
import type { Product } from '../types/product.type';

export const handleDecreaseQuantity = (productId) => {
  cartStore.removeCartItem(productId);
  const cartItem = cartStore.getCartItemByProductId(productId);

  if (cartItem?.getQuantity() === 0) {
    getProductItemElement(productId)?.remove();
  } else {
    updateCartItem(productId, cartItem);
  }
};

export const canIncreaseQuantity = ({ product, cartItem }: { product: Product; cartItem?: Cart }) =>
  product.quantity > (cartItem?.quantity || 0);

export const getTotalQuantity = (cartItems: Cart[]) => cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const calculatePoint = (amount: number) => Math.floor(amount / 1000);
