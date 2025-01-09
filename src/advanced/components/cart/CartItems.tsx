import { CartItem } from '../../types/cart';
import { Product } from '../../types/product';

interface CartItemsProps {
  cartItems: CartItem[];
  products: Product[];
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItems: React.FC<CartItemsProps> = ({
  cartItems,
  products,
  onQuantityChange,
  onRemoveItem,
}) => (
  <div id='cart-items'>
    {cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      return (
        <div key={product.id} id={product.id} className='flex justify-between items-center mb-2'>
          <span>
            {product.name} - {product.price}원 x {item.quantity}
          </span>
          <div>
            <button
              className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
              onClick={() => onQuantityChange(product.id, -1)}
            >
              -
            </button>
            <button
              className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
              onClick={() => onQuantityChange(product.id, 1)}
            >
              +
            </button>
            <button
              className='remove-item bg-red-500 text-white px-2 py-1 rounded'
              onClick={() => onRemoveItem(product.id)}
            >
              삭제
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

export default CartItems;
