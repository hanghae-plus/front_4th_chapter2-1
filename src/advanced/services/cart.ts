import type { Cart } from '../types/cart.type';
import type { Product } from '../types/product.type';

export const canIncreaseQuantity = ({ product, cartItem }: { product: Product; cartItem?: Cart }) =>
  product.quantity > (cartItem?.quantity || 0);

export const getTotalQuantity = (cartItems: Cart[]) => cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const calculatePoint = (amount: number) => Math.floor(amount / 1000);
