import React from "react";
import { Product } from "../../types";

interface ProductSelectProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
}

const ProductSelect: React.FC<ProductSelectProps> = ({
  products,
  onAddToCart,
}) => {
  return (
    <div className="flex gap-2 mb-4">
      <select
        className="p-2 border rounded"
        onChange={(e) => onAddToCart(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          상품을 선택하세요
        </option>
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock <= 0}
          >
            {product.name} - {product.price}원 (재고: {product.stock})
          </option>
        ))}
      </select>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          const select = document.querySelector("select") as HTMLSelectElement;
          if (select.value) onAddToCart(select.value);
        }}
      >
        추가
      </button>
    </div>
  );
};

export default ProductSelect;
