import { DOM_IDS, PRODUCT_LIST } from "advanced/constants";
import { useCartContext } from "advanced/hooks/useCartContext";
import { Product } from "advanced/models/Product";

export const ProductOptions = () => {
  const { addItem } = useCartContext();

  /**
   * 장바구니에 상품 추가
   *
   * @param event - '추가'버튼이 포함된 Form 이벤트 객체
   */
  const handleAddItemToCart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentTarget = new FormData(event.currentTarget);
    const selectedID = currentTarget.get("selectedProduct");

    const itemToAdd = PRODUCT_LIST.find(
      (product: Product) => product.id === selectedID
    );
    if (!itemToAdd) return;

    addItem(itemToAdd);
  };

  return (
    <form onSubmit={(event) => handleAddItemToCart(event)}>
      <select
        id={DOM_IDS.PRODUCT_SELECT}
        className="mr-2 rounded border p-2"
        name="selectedProduct"
        aria-label="상품 선택"
      >
        {PRODUCT_LIST.map((product) => (
          <option
            key={product.id}
            id={product.id}
            disabled={product.remaining === 0}
            value={product.id}
          >
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        type="submit"
        id={DOM_IDS.ADD_TO_CART_BTN}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        추가
      </button>
    </form>
  );
};
