import React, { useState } from "react";

/**
 * ProductSelector
 * - products: 상품 목록을 포함한 배열. 상품은 id, name, price, quantity 속성을 가짐
 * - onAdd: 선택한 상품을 장바구니에 추가하는 함수. selectedProduct를 인자로 받음
 */
const ProductSelector = ({ products, onAdd }) => {
  // 선택된 상품의 상태 관리하는 state. 첫번째 상품의 Id로 초기값 설정
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");

  // 장바구니 추가 함수
  const handleAdd = () => {
    if (selectedProduct) {
      onAdd(selectedProduct);
    }
  };

  return (
    <div className="flex gap-2">
      {/* 상품 select 박스 */}
      <select
        className="flex-1 border rounded p-2"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        {/* 상품 목록을 순회하며 옵션 요소 생성 */}
        {products.map(product => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.quantity === 0}
          >
            {/* 상품의 이름과 가격, 품절 여부 표시 */}
            {product.name} - {product.price.toLocaleString()}원
            {product.quantity === 0 ? " (품절)" : ""}
          </option>
        ))}
      </select>
      {/* 장바구니에 상품 추가 버튼 */}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAdd}
        disabled={!selectedProduct || products.find(p => p.id === selectedProduct)?.quantity === 0}
      >
        추가
      </button>
    </div>
  );
}

export default ProductSelector;