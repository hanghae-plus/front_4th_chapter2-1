
import { ICartItem } from '../type/product';

interface ICartProps {
  cartItems: ICartItem[];
  onChangeQuantity: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
}

const Cart: React.FC<ICartProps> = ({ cartItems, onChangeQuantity, onRemoveItem }) => {
  return (
    <div id="cart-items" className="cart">
      {cartItems.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.productId}
            id={item.productId}
            className="flex justify-between items-center mb-2"
          >
            <span>
              {item.name} - {item.price.toLocaleString()}원 x {item.quantity}
            </span>
            <div>
              <button
                className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                onClick={() => onChangeQuantity(item.productId, -1)}
              >
                -
              </button>
              <button
                className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                onClick={() => onChangeQuantity(item.productId, 1)}
              >
                +
              </button>
              <button
                className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => onRemoveItem(item.productId)}
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
