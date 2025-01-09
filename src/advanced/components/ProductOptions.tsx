import { Product } from "../types/product";

export function ProductOption(product: Product) {
  return (
    <option value={product.id} disabled={product.quantity === 0}>
      {product.name} - {product.price}원
    </option>
  );
}
