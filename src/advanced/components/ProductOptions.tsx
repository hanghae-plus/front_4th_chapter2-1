import { DOM_IDS } from "advanced/constants";
import { useCartContext } from "advanced/contexts/CartProvider";
import { productList } from "advanced/hooks/productList";
import { Product } from "advanced/models/Product";

export const ProductOptions = () => {
  const { addItem } = useCartContext();

  const handleAddToCart = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = new FormData(event.currentTarget);
    const selectedID = target.get("selectedProduct");

    const itemToAdd = productList.find(
      (product: Product) => product.id === selectedID
    );

    if (itemToAdd) {
      addItem(itemToAdd);
    } else {
      alert("선택된 상품을 찾을 수 없습니다.");
    }
  };

  return (
    <>
      <form onSubmit={(event) => handleAddToCart(event)}>
        <select
          id={DOM_IDS.PRODUCT_SELECT}
          className="mr-2 rounded border p-2"
          name="selectedProduct"
        >
          {productList.map((product) => (
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
    </>
  );
};
