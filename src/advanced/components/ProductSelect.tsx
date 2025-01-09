import { ELEMENT_IDS } from "@/constants/element-id";
import type { Product } from "@/data/products";

interface ProductSelectProps {
  products: Product[];  
}

const ProductSelect = ({ products }:ProductSelectProps) => {
  return (
    <select id={ELEMENT_IDS.PRODUCT_SELECT} className="border rounded p-2 mr-2">
      {products.map(({ id, name, price, quantity }) => (
        <option key={id} value={id} disabled={quantity === 0}>
          {name} - {price}원
        </option>
      ))}
    </select>
  );
};

export default ProductSelect;
