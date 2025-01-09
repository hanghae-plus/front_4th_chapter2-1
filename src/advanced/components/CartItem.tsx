import { Product } from "../types/product";
import { CartItemInfo } from "./CartItemInfo";

export function CartItem(product: Product) {
  return (
    <div id={product.id} className="flex justify-between items-center mb-2">
      <CartItemInfo {...product} />
      <div>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id={product.id} data-change={-1}>
          -
        </button>
        <button className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id={product.id} data-change={1}>
          +
        </button>
        <button className="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id={product.id}>
          삭제
        </button>
      </div>
    </div>
  );
}
