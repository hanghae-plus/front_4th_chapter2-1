import { Product } from "../../types/cart";

interface ProductSelectProps {
  products: Product[];
  onSelect: (productId: string) => void;
}

export function ProductSelect({ products, onSelect }: ProductSelectProps) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="border rounded p-2 w-full mb-4"
    >
      <option value="">상품을 선택하세요</option>
      {products.map((product) => (
        <option key={product.id} value={product.id} disabled={product.q === 0}>
          {product.name} - {product.val}원
        </option>
      ))}
    </select>
  );
}
