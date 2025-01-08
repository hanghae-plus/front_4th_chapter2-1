import { DOM_IDS } from "advanced/constants";
import { CartItem, useCart } from "advanced/contexts/CartContext";

interface NewItemProps {
  product: CartItem;
}
export const NewItem: React.FC<NewItemProps> = ({ product }) => {
  const { addItem, removeItem, changeQuantity } = useCart();

  return (
    <div
      id={DOM_IDS.CART_ITEMS}
      className="mb-2 flex items-center justify-between"
    >
      <span>
        {product.name} - {product.price}원 x {product.quantity}
      </span>
      <div>
        <button
          className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          data-product-id={product.id}
          data-change="-1"
          onClick={() => addItem(product)}
        >
          -
        </button>
        <button
          className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          data-product-id={product.id}
          data-change="1"
          onClick={() => changeQuantity(product.id, product.quantity)}
        >
          +
        </button>
        <button
          className="remove-item rounded bg-red-500 px-2 py-1 text-white"
          data-product-id={product.id}
          onClick={() => removeItem(product.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
