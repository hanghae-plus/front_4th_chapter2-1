import { useProductListContext } from "../hooks";
import { Product } from "../types";
import { CartItemInfo } from "./CartItemInfo";

export function CartItem(product: Product) {
  const { getCartProductById, removeCart, increaseCart, decreaseCart, getStockProductById, increaseStock, decreaseStock } = useProductListContext();

  const handleDecreaseButton = () => {
    const id = product.id;
    const cartProduct = getCartProductById(id) as Product;
    const newCartProductQuantity = cartProduct.quantity - 1;

    if (newCartProductQuantity <= 0) {
      removeCart(id);
    }

    decreaseCart(id);
    increaseStock(id);
  };

  const handleIncreaseButton = () => {
    const id = product.id;
    const stockProduct = getStockProductById(id) as Product;
    const newStockProductQuantity = stockProduct.quantity - 1;

    if (newStockProductQuantity < 0) {
      alert("재고가 부족합니다.");
      return;
    }

    decreaseStock(id);
    increaseCart(id);
  };

  const handleRemoveButton = () => {
    const id = product.id;
    removeCart(id);
    increaseStock(id);
  };

  return (
    <div id={product.id} className="flex justify-between items-center mb-2">
      <CartItemInfo {...product} />
      <div>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={handleDecreaseButton}>
          -
        </button>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" onClick={handleIncreaseButton}>
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" onClick={handleRemoveButton}>
          삭제
        </button>
      </div>
    </div>
  );
}
