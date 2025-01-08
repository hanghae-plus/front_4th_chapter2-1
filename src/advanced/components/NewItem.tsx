import { DOM_IDS } from "advanced/constants";
import { CartItem, useCart } from "advanced/contexts/CartContext";
import { useCartContext } from "advanced/contexts/CartProvider";

interface NewItemProps {
  product: CartItem;
}

export const NewItem: React.FC<NewItemProps> = ({ product }) => {
  const { removeItem, changeQuantity } = useCartContext();

  const handleUpdateQuantity = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const { productId, change } = event.currentTarget.dataset;
    if (!productId || !change) return;

    changeQuantity(productId, parseInt(change));
  };

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
          onClick={(e) => handleUpdateQuantity(e)}
        >
          -
        </button>
        <button
          className="quantity-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          data-product-id={product.id}
          data-change="1"
          onClick={(e) => handleUpdateQuantity(e)}
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
