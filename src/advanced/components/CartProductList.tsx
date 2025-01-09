import type { Product } from '../types/product.type';

export const CartProductList = ({ cartItems }: { cartItems: Product[] }) => {
  return (
    <div id="cart-items">
      {cartItems.map((product) => (
        <CartProduct key={product.id} product={product} />
      ))}
    </div>
  );
};

const CartProduct = ({ product }: { product: Product }) => {
  return <span>{`${product.name} - ${product.originalPrice}원 x ${product.quantity}`}</span>;
};
