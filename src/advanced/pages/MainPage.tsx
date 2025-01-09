import { useRef } from "react";
import { Cart, ProductOption } from "../components";
import { useProductListContext } from "../hooks";

export function MainPage() {
  const { shoppingCart, addToCart, increaseCart, products, getLowStockMessage, decreaseStock } = useProductListContext();
  const selectProductRef = useRef<HTMLSelectElement | null>(null);

  const addToCartClickHandler = () => {
    const selectedProductId = selectProductRef.current?.value;
    const productToAdd = products.find((prod) => prod.id === selectedProductId);

    if (!(productToAdd && productToAdd.quantity > 0)) {
      alert("재고가 부족합니다.");
      return;
    }

    decreaseStock(productToAdd.id);

    const existingCartItem = shoppingCart.find((prod) => prod.id === selectedProductId);
    if (existingCartItem) {
      increaseCart(existingCartItem.id);
      return;
    }
    addToCart(productToAdd);
  };

  return (
    <div id="cont" className="bg-gray-100 p-8">
      <div id="wrap" className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Cart />
        <select id="product-select" ref={selectProductRef} className="text-xl font-bold my-4">
          {products.map((product) => (
            <ProductOption key={product.id} {...product} />
          ))}
        </select>
        <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addToCartClickHandler}>
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {getLowStockMessage()}
        </div>
      </div>
    </div>
  );
}
