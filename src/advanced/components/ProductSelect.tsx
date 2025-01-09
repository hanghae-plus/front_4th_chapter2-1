import { ELEMENT_IDS } from '../constants/element-id';
import type { Product } from '../types/product.type';

interface ProductSelectProps {
  products: Product[];
  onSelect: (productId: string) => void;
  selectedProductId: string;
}

const ProductSelect = ({ products, onSelect, selectedProductId }: ProductSelectProps) => {
  return (
    <select
      id={ELEMENT_IDS.PRODUCT_SELECT}
      className="border rounded p-2 mr-2"
      value={selectedProductId}
      onChange={(e) => onSelect(e.target.value)}
    >
      {products.map(({ id, name, price, quantity }) => (
        <option key={id} value={id} disabled={quantity === 0}>
          {name} - {price}원
        </option>
      ))}
    </select>
  );
};
export default ProductSelect;
