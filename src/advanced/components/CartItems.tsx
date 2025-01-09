import type { CartItem, Product } from '../pages/CartPage';

interface CartItemsProps {
  cartItems: CartItem[];
  productList: Product[];
}

export const CartItems = ({ cartItems, productList }: CartItemsProps) => {
  return <div id='cart-items'>CartItems</div>;
};
