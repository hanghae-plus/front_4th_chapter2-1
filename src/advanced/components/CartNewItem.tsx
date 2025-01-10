import { DOM_IDS } from "advanced/constants";
import { CartItem } from "advanced/state/cartReducer";
import { useCartContext } from "advanced/hooks/useCartContext";

interface NewItem {
  product: CartItem;
}

export const CartNewItem: React.FC<NewItem> = ({ product }) => {
  const { removeItem, changeQty } = useCartContext();

  /**
   * 장바구니에 담긴 상품의 수량 변경 및 삭제
   *
   * @param event - 클릭한 버튼의 이벤트 객체
   * @returns type CartItem
   */
  const handleUpdateQty = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const { productId, change } = event.currentTarget.dataset;
    if (!productId || !change) return;

    changeQty(productId, parseInt(change));
  };

  return (
    <div
      id={DOM_IDS.CART_ITEMS}
      className="mb-2 flex items-center justify-between"
    >
      <span>
        {product.name} - {product.price}원 x {product.qty}
      </span>
      <div>
        <button
          className="qty-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          data-product-id={product.id}
          data-change="-1"
          onClick={(event) => handleUpdateQty(event)}
        >
          -
        </button>
        <button
          className="qty-change mr-1 rounded bg-blue-500 px-2 py-1 text-white"
          data-product-id={product.id}
          data-change="1"
          onClick={(event) => handleUpdateQty(event)}
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
